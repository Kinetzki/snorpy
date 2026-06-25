import React, { useEffect } from "react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArrowDownToLine } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useProxyStore } from "@/stores/proxyStore";
import { toast } from "sonner";

const ProxyControls:React.FC = () => {
    const { isProxyRunning, proxyCaCert, proxyPort, onToggleProxy, setProxyPort } = useProxyStore();
    const debouncedProxyPort = useDebounce<number>(proxyPort);

    const onProxyChange = async (checked: boolean) => {
        if (checked) {
            const res = await window.snorpy.start();
            const { cert } = res;
            onToggleProxy({
                isChecked: true,
                cert
            })
            console.log(res);
            toast.success(`Proxy started successfully`, {
                position: "top-center",
                description: `Connect via port: ${proxyPort}`
            })
            return;
        }
        await window.snorpy.stop();
        toast.success("Proxy stopped", {position: "top-center"})
        onToggleProxy({
            isChecked: false,
            cert: null
        })
    };

    const onPortChange = (newPort: number) => {
        setProxyPort(newPort)
    }

    const onDownloadCert = async () => {
        if (!proxyCaCert) return;

        const certBlob = new Blob([proxyCaCert], { type: 'application/x-x509-ca-cert' });

        const downloadUrl = URL.createObjectURL(certBlob);

        const _a = document.createElement("a");
        _a.href = downloadUrl;
        _a.download = 'snorpy.crt';

        _a.click();
        _a.remove();
    }

    useEffect(() => {
        window.snorpy.setPort(debouncedProxyPort)
    }, [debouncedProxyPort])

    return (
        <section className="flex items-center justify-between w-full h-full bg-card/70 p-6 border-b text-secondary-foreground/80">
            <section className="flex items-center gap-12">
                <section className="flex items-center justify-between w-50">
                    <Label htmlFor="proxy-status" className="text-md">
                        Proxy
                    </Label>
                    <span className="flex items-center">
                        <Switch 
                            id="proxy-status" 
                            onCheckedChange={onProxyChange} 
                            checked={isProxyRunning}
                        />
                    </span>
                </section>
                <section className="flex items-center justify-between w-60">
                    <Label htmlFor="proxy-port" className="text-md">
                        Port
                    </Label>
                    <span className="flex items-center">
                        <Input
                            className="min-w-4 h-8"
                            id="proxy-port"
                            type="number"
                            placeholder="proxy port"
                            disabled={isProxyRunning}
                            value={proxyPort}
                            onChange={(e) => {
                                onPortChange(e.target.valueAsNumber)
                            }}
                        />
                    </span>
                </section>
            </section>
            
            <section className="flex items-center justify-between gap-2 w-40">
                <Label htmlFor="proxy-status" className="text-md">
                    SSL Certificate
                </Label>
                <span>
                    <Button 
                        variant={"ghost"} 
                        disabled={!!!proxyCaCert} 
                        onClick={onDownloadCert}
                    >
                        <ArrowDownToLine />
                    </Button>
                </span>
            </section>
        </section>
    );
};

export default ProxyControls;
