import { app } from 'electron';
import fs from 'node:fs/promises'; // Use the promise-based API for non-blocking I/O
import path from 'node:path';
import * as mockttp from "mockttp";

export class CertManager {
    static getInternalPath(...subPaths: string[]): string {
        const userData = app.getPath('userData');
        return path.join(userData, ...subPaths);
    }

    static async ensureDirectory(directoryPath: string): Promise<void> {
        try {
            await fs.mkdir(directoryPath, { recursive: true });
        } catch (error) {
            console.error(`Failed to create directory at ${directoryPath}:`, error);
            throw error;
        }
    }

    static async makeCerts(absolutePath: string): Promise<{
        cert: string,
        key: string
    }> {
        try {
            // Ensure the parent directory exists first
            await this.ensureDirectory(absolutePath);
            const certPath = path.join(absolutePath, "ca.crt");
            const keyPath = path.join(absolutePath, "ca.key");

            // check if cert and key exists
            let certFile: string | null = null;
            let keyFile: string | null = null;

            try {
                [ certFile, keyFile ] = await Promise.all([
                    fs.readFile(certPath, 'utf8'),
                    fs.readFile(keyPath, 'utf8'),
                ])
            } catch(readError: any) {
                console.log("Read error", readError)
                if (readError.code !== 'ENOENT') throw readError;
            }

            if (!certFile || !keyFile) {
                const serverHttps = await mockttp.generateCACertificate({
                    subject: {
                        commonName: "Snorpy Interception Proxy Root CA",
                        organizationName: "Snorpy Dev Tools"
                    },
                    bits: 2048
                });
                const cert = serverHttps.cert;
                const certKey = serverHttps.key;

                await Promise.all([
                    fs.writeFile(certPath, cert, 'utf8'),
                    fs.writeFile(keyPath, certKey, 'utf8'),
                ])
                console.log("NEW Certs created")
                return {
                    cert: cert,
                    key: certKey
                }
            } else {
                console.log("Existing certs found")
                return {
                    cert: certFile,
                    key: keyFile
                }
            }
            
        } catch (error) {
            console.error(`Failed to write file to ${absolutePath}:`, error);
            throw error;
        }
    }
}