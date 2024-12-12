import 'express';

declare module 'express' {
  interface Request {
    envoy?: {
      job: {
        attach: (data: { label: string; value: string }) => Promise<void>;
      };
      meta: {
        config: Record<string, any>;
      };
      payload: {
        attributes: Record<string, string>;
      };
    };
  }
}
