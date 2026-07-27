const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');

function parseArgs(argv = process.argv.slice(2)) {
  const parsed = {
    sourceRef: 'HEAD',
    outputDir: null,
    specPath: path.join(ROOT, 'release-specs', 'dhm10-homepage.json'),
    contractOnly: false
  };

  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--source' && argv[i + 1]) parsed.sourceRef = argv[++i];
    else if (argv[i] === '--out' && argv[i + 1]) parsed.outputDir = path.resolve(argv[++i]);
    else if (argv[i] === '--spec' && argv[i + 1]) parsed.specPath = path.resolve(argv[++i]);
    else if (argv[i] === '--check-contract-only') parsed.contractOnly = true;
  }

  if (!parsed.contractOnly && !parsed.outputDir) {
    throw new Error('--out is required for a release build');
  }
  return parsed;
}

function git(args, options = {}) {
  return execFileSync('git', args, {
    cwd: ROOT,
    encoding: options.encoding || 'utf8',
    maxBuffer: 32 * 1024 * 1024,
    ...options
  }).trim();
}

function isRuntimePath(relativePath) {
  const rel = relativePath.replace(/\\/g, '/');
  const allowedDirectories = ['api/', 'assets/', 'data/', 'dh8/'];
  if (allowedDirectories.some(prefix => rel.startsWith(prefix))) return true;
  if (rel.includes('/')) return false;

  const explicit = new Set(['package.json', 'package-lock.json', 'vercel.json', '.vercelignore']);
  if (explicit.has(rel)) return true;

  const extension = path.extname(rel).toLowerCase();
  return ['.html', '.css', '.js', '.json', '.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.mp4', '.ico'].includes(extension)
    && !/^(run_uat|record_demo|dh4hn_uat|test_)/i.test(rel);
}

function listRuntimeFiles(sourceRef) {
  const files = git(['ls-tree', '-r', '--name-only', sourceRef]).split(/\r?\n/).filter(Boolean);
  const runtimeFiles = files.filter(isRuntimePath);
  if (runtimeFiles.length === 0) throw new Error(`No runtime files found in ${sourceRef}`);
  return runtimeFiles.sort();
}

function extractTar(tarPath, outputDir) {
  const tarBuffer = fs.readFileSync(tarPath);
  const outputRoot = path.resolve(outputDir) + path.sep;
  let offset = 0;

  while (offset + 512 <= tarBuffer.length) {
    const header = tarBuffer.subarray(offset, offset + 512);
    offset += 512;
    if (header.every(byte => byte === 0)) break;

    let name = header.subarray(0, 100).toString('utf8').replace(/\0.*$/, '');
    const prefix = header.subarray(345, 500).toString('utf8').replace(/\0.*$/, '');
    if (prefix) name = `${prefix}/${name}`;
    const sizeText = header.subarray(124, 136).toString('utf8').replace(/\0.*$/, '').trim();
    const size = parseInt(sizeText, 8) || 0;
    const type = String.fromCharCode(header[156]);
    const fileData = tarBuffer.subarray(offset, offset + size);
    offset += Math.ceil(size / 512) * 512;

    const destination = path.resolve(outputDir, name);
    if (!destination.startsWith(outputRoot)) throw new Error(`Unsafe archive path: ${name}`);
    if (type === '5' || name.endsWith('/')) fs.mkdirSync(destination, { recursive: true });
    else if (type === '0' || type === '\0' || type === '') {
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(destination, fileData);
    }
  }
}

function extractSnapshot(sourceRef, runtimeFiles, outputDir) {
  const tarPath = path.join(os.tmpdir(), `dh-release-${Date.now()}-${process.pid}.tar`);
  try {
    if (fs.existsSync(outputDir)) fs.rmSync(outputDir, { recursive: true, force: true });
    fs.mkdirSync(outputDir, { recursive: true });
    execFileSync('git', ['archive', '--format=tar', `--output=${tarPath}`, sourceRef, '--', ...runtimeFiles], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 32 * 1024 * 1024
    });
    extractTar(tarPath, outputDir);
  } finally {
    if (fs.existsSync(tarPath)) fs.rmSync(tarPath, { force: true });
  }
}

function validateProjectBinding(spec) {
  const projectFile = path.join(ROOT, '.vercel', 'project.json');
  if (!fs.existsSync(projectFile)) throw new Error('Missing .vercel/project.json');
  const binding = JSON.parse(fs.readFileSync(projectFile, 'utf8'));
  if (binding.projectId !== spec.project.id || binding.orgId !== spec.project.orgId) {
    throw new Error(`Vercel binding mismatch: expected ${spec.project.id}/${spec.project.orgId}`);
  }
  return binding;
}

function assertSpecMatchesSource(sourceRef, specPath) {
  const relativeSpec = path.relative(ROOT, specPath).replace(/\\/g, '/');
  if (relativeSpec.startsWith('../') || path.isAbsolute(relativeSpec)) {
    throw new Error('Release spec must be inside the repository');
  }
  let committedSpec;
  try {
    committedSpec = execFileSync('git', ['show', `${sourceRef}:${relativeSpec}`], {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 4 * 1024 * 1024
    });
  } catch (error) {
    throw new Error(`Release spec is not present in source ref ${sourceRef}: ${relativeSpec}`);
  }
  const workingSpec = fs.readFileSync(specPath, 'utf8');
  const normalize = value => value.replace(/\r\n/g, '\n').trimEnd();
  if (normalize(committedSpec) !== normalize(workingSpec)) {
    throw new Error(`Release spec differs from source ref ${sourceRef}: ${relativeSpec}`);
  }
}

function validateContract(packageDir, spec) {
  const failures = [];
  for (const route of spec.routes) {
    const filePath = path.join(packageDir, route.sourceFile);
    if (!fs.existsSync(filePath)) {
      failures.push(`${route.path}: missing ${route.sourceFile}`);
      continue;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    for (const expected of route.expectedTexts || []) {
      if (!content.includes(expected)) failures.push(`${route.path}: missing expected text: ${expected}`);
    }
    for (const forbidden of route.forbiddenTexts || []) {
      if (content.includes(forbidden)) failures.push(`${route.path}: found forbidden text: ${forbidden}`);
    }
  }

  const indexHtml = fs.readFileSync(path.join(packageDir, 'index.html'), 'utf8');
  const anchorRegex = /<a\b[^>]*\bhref=["']([^"']+)["']/gi;
  let match;
  while ((match = anchorRegex.exec(indexHtml)) !== null) {
    const href = match[1];
    if (!href || /^(https?:|mailto:|tel:|#|javascript:)/i.test(href)) continue;
    const clean = href.split(/[?#]/)[0].replace(/^\//, '');
    if (!clean) continue;
    const candidates = clean.endsWith('/')
      ? [path.join(packageDir, clean, 'index.html')]
      : [path.join(packageDir, clean), path.join(packageDir, `${clean}.html`)];
    if (!candidates.some(candidate => fs.existsSync(candidate))) failures.push(`CTA target missing: ${href}`);
  }

  if (failures.length) throw new Error(`Release contract failed:\n- ${failures.join('\n- ')}`);
  return { routeCount: spec.routes.length };
}

function computeManifest(packageDir, runtimeFiles) {
  const lines = runtimeFiles.map(relativePath => {
    const content = fs.readFileSync(path.join(packageDir, relativePath));
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    return `${relativePath}:${hash}`;
  });
  return crypto.createHash('sha256').update(lines.join('\n')).digest('hex');
}

function stampRelease(packageDir, release) {
  const indexPath = path.join(packageDir, 'index.html');
  let indexHtml = fs.readFileSync(indexPath, 'utf8');
  const meta = [
    `<meta name="release-id" content="${release.releaseId}">`,
    `<meta name="release-commit" content="${release.commit}">`,
    `<meta name="release-manifest" content="${release.manifestSha256}">`
  ].join('\n  ');
  indexHtml = indexHtml.replace('</head>', `  ${meta}\n</head>`);
  fs.writeFileSync(indexPath, indexHtml, 'utf8');

  const vercelPath = path.join(packageDir, 'vercel.json');
  const vercelConfig = fs.existsSync(vercelPath) ? JSON.parse(fs.readFileSync(vercelPath, 'utf8')) : {};
  vercelConfig.cleanUrls = true;
  vercelConfig.headers = (vercelConfig.headers || []).filter(rule => rule.source !== '/(.*)');
  vercelConfig.headers.push({
    source: '/(.*)',
    headers: [
      { key: 'x-release-id', value: release.releaseId },
      { key: 'x-release-commit', value: release.commit },
      { key: 'x-release-manifest', value: release.manifestSha256 }
    ]
  });
  fs.writeFileSync(vercelPath, `${JSON.stringify(vercelConfig, null, 2)}\n`, 'utf8');
  fs.writeFileSync(path.join(packageDir, 'release.json'), `${JSON.stringify(release, null, 2)}\n`, 'utf8');
}

function assertCleanWorktree() {
  const status = git(['status', '--porcelain=v1', '--untracked-files=all']);
  if (status) throw new Error(`Refusing release build from dirty worktree:\n${status}`);
}

function buildRelease(options) {
  const spec = JSON.parse(fs.readFileSync(options.specPath, 'utf8'));
  const binding = validateProjectBinding(spec);
  if (!options.contractOnly) assertSpecMatchesSource(options.sourceRef, options.specPath);
  const runtimeFiles = listRuntimeFiles(options.sourceRef);
  const temporaryDir = options.contractOnly
    ? fs.mkdtempSync(path.join(os.tmpdir(), 'dh-contract-'))
    : options.outputDir;

  try {
    extractSnapshot(options.sourceRef, runtimeFiles, temporaryDir);
    const contract = validateContract(temporaryDir, spec);
    if (options.contractOnly) {
      return { mode: 'contract-only', sourceRef: options.sourceRef, contract, binding, runtimeFileCount: runtimeFiles.length };
    }

    assertCleanWorktree();
    const fullCommitSha = git(['rev-parse', options.sourceRef]);
    const commit = git(['rev-parse', '--short=12', options.sourceRef]);
    const manifestSha256 = computeManifest(temporaryDir, runtimeFiles);
    const release = {
      schemaVersion: 1,
      releaseId: `${commit}-${manifestSha256.slice(0, 12)}`,
      commit,
      fullCommitSha,
      manifestSha256,
      sourceRef: options.sourceRef,
      builtAt: new Date().toISOString(),
      provenance: 'git-archive-runtime-allowlist',
      runtimeFileCount: runtimeFiles.length,
      projectId: spec.project.id,
      orgId: spec.project.orgId,
      productionUrl: spec.productionUrl
    };
    stampRelease(temporaryDir, release);
    return { mode: 'release-build', outputDir: temporaryDir, contract, binding, release };
  } finally {
    if (options.contractOnly && fs.existsSync(temporaryDir)) fs.rmSync(temporaryDir, { recursive: true, force: true });
  }
}

if (require.main === module) {
  try {
    const result = buildRelease(parseArgs());
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { buildRelease, computeManifest, isRuntimePath, parseArgs, validateContract };
