/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'liveblocks.io',
                port: ''
            }
        ]
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
          config.node = {
            fs: 'empty',
            binaries: false,
          };
        }
        return config;
    },
};

export default nextConfig;
