import routes from '../admin.routes';

describe('routes() routes method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should contain a route for docs with the correct path and title', () => {
      const docsRoute = routes.find(route => route.path === 'docs');
      expect(docsRoute).toBeDefined();
      expect(docsRoute?.title).toBe('global.menu.admin.apidocs');
    });

    it('should contain a route for configuration with the correct path and title', () => {
      const configRoute = routes.find(route => route.path === 'configuration');
      expect(configRoute).toBeDefined();
      expect(configRoute?.title).toBe('configuration.title');
    });

    it('should contain a route for health with the correct path and title', () => {
      const healthRoute = routes.find(route => route.path === 'health');
      expect(healthRoute).toBeDefined();
      expect(healthRoute?.title).toBe('health.title');
    });

    it('should contain a route for logs with the correct path and title', () => {
      const logsRoute = routes.find(route => route.path === 'logs');
      expect(logsRoute).toBeDefined();
      expect(logsRoute?.title).toBe('logs.title');
    });

    it('should contain a route for metrics with the correct path and title', () => {
      const metricsRoute = routes.find(route => route.path === 'metrics');
      expect(metricsRoute).toBeDefined();
      expect(metricsRoute?.title).toBe('metrics.title');
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should not contain any duplicate paths', () => {
      const paths = routes.map(route => route.path);
      const uniquePaths = new Set(paths);
      expect(uniquePaths.size).toBe(paths.length);
    });

    it('should not contain any undefined loadComponent functions', () => {
      routes.forEach(route => {
        expect(route.loadComponent).toBeDefined();
        expect(typeof route.loadComponent).toBe('function');
      });
    });

    it('should handle an empty routes array gracefully', () => {
      const emptyRoutes: typeof routes = [];
      expect(emptyRoutes.length).toBe(0);
    });

    it('should have all titles as non-empty strings', () => {
      routes.forEach(route => {
        expect(route.title).toBeDefined();
        expect(typeof route.title).toBe('string');
        expect(route.title.length).toBeGreaterThan(0);
      });
    });
  });
});
