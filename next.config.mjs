import withPWAInit from "@ducanh2912/next-pwa";


const withPWA = withPWAInit({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnline: true,
    swcMinify: true,
    fallbacks: {
        document: "/offline",
    },

    workboxOptions: {
        disableDevLogs: true,
    },
})

const nextConfig = {
    images: {
        remotePatterns: [{ hostname: "images.pexels.com" }],
        // domains: [ "backbrains.econneq.com" ],
    },
    trailingSlash: true,
    experimental: {
        reactCompiler: true,
        serverActions: {
            allowedOrigins: [
                "localhost:3000", "localhost:4000", "e-conneq.com", 
                "school.e-conneq.com", "brains.e-conneq.com", "joan.e-conneq.com", "kings.e-conneq.com",
                "vishi.e-conneq.com",
            ],
        },
        turbo: {
            rules: {
                '*.svg': {
                    loaders: ['@svgr/webpack'],
                    as: '*.js',
                },
            },
        },
    },

    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                fs: false,
            };
        }

        return config;
    },

};

export default withPWA(nextConfig)
