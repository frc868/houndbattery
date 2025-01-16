import { config as dotenvConfig } from 'dotenv';
import webpack from 'webpack';
import { NextConfig } from 'next';

dotenvConfig();

const nextConfig: NextConfig = {
  webpack(config, options) {
    config.plugins.push(new webpack.DefinePlugin({
      'process.env.CLIENT_NAME': JSON.stringify(process.env.CLIENT_NAME),
      'process.env.CLIENT_ID': JSON.stringify(process.env.CLIENT_ID),
      'process.env.CLIENT_SECRET': JSON.stringify(process.env.CLIENT_SECRET),
      'process.env.NEXT_PUBLIC_API_BASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_API_BASE_URL),
    }));
    return config;
  },
};

export default nextConfig;