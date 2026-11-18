const { ROUTE_METHODS, createVercelHandler } = require('../lib/arch01/vercel_handler');

const handlers = new Map();

module.exports = async function arch01Router(request, response) {
    let parsedUrl;
    try {
        parsedUrl = new URL(request.url || '/', 'http://localhost');
    } catch {
        response.writeHead(400, {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff'
        });
        return response.end(JSON.stringify({ success: false, error: 'INVALID_REQUEST_PATH' }));
    }

    const routedPath = parsedUrl.searchParams.get('__arch01_route') || parsedUrl.pathname;
    if (!ROUTE_METHODS[routedPath]) {
        response.writeHead(404, {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff'
        });
        return response.end(JSON.stringify({ success: false, error: 'ROUTE_NOT_FOUND' }));
    }

    parsedUrl.searchParams.delete('__arch01_route');
    const cleanSearch = parsedUrl.searchParams.toString();
    request.url = routedPath + (cleanSearch ? `?${cleanSearch}` : '');

    if (!handlers.has(routedPath)) {
        handlers.set(routedPath, createVercelHandler(routedPath));
    }
    return handlers.get(routedPath)(request, response);
};
