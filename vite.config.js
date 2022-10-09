/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import dns from 'dns'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
    server: {
        port: process.env.PORT
    }
});
