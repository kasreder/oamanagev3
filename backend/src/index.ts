import 'dotenv/config';

const bootstrap = async (): Promise<void> => {
  // TODO: Implement server bootstrap in future phases.
  if (process.env.NODE_ENV !== 'production') {
    console.log('🚀 OA Asset Manager backend initialized (Phase 1 setup).');
  }
};

void bootstrap();
