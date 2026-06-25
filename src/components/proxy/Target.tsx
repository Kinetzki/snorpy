import React, { useEffect, useState } from 'react'
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from '../ui/field';
import { Input } from '../ui/input';
import { useProxyStore } from '@/stores/proxyStore';
import { Button } from '../ui/button';
import { useAppStore } from '@/stores/AppStore';
import { toast } from 'sonner';

const Target:React.FC = () => {
  const { proxyTarget, setProxyTarget } = useProxyStore();
  const { networkLogs } = useAppStore();
  const [ isInvalid, setIsInvalid ] = useState<boolean>(false);
  const [ uniqueDomains, setUniqueDomains ] = useState<string[]>([]);

  const validateUrl = (url: string): boolean => {
    try {
      if (url === "*") return true;

      let cleanInput = url;
      if (cleanInput.startsWith('http://') || cleanInput.startsWith('https://')) {
        return false;
      }

      if (cleanInput.startsWith('*.')) {
        cleanInput = cleanInput.substring(2); // Strip the '*.'
      }

      if (cleanInput.endsWith('/')) {
        return false;
      }

      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])+$/;
      
      return domainRegex.test(cleanInput);
    } catch (error) {
      return false
    }
  }

  const onSave = async () => {
    const isUrlValid = validateUrl(proxyTarget);

    if (!isUrlValid) {
      setIsInvalid(true);
      return;
    }

    window.snorpy.setTarget(proxyTarget);
    toast.success("Target Domain Saved!", {position: "top-center"})
  }

  useEffect(() => {
    const allDomains = [...new Set(networkLogs.map(el => el.request.destination))];
    allDomains.sort((a, b) => a.localeCompare(b));

    setUniqueDomains([...allDomains]);
  }, [networkLogs])

  return (
    <div className="w-full h-full min-h-full grid grid-cols-[40%_60%]">
      <div className="flex h-full min-h-0 flex-col items-start">
        <section className="bg-secondary/40 w-full border-b p-2">
          <h1 className="font-semibold">Logged Domains</h1>
        </section>
        <div className="w-full flex-1 min-h-0 flex flex-col overflow-y-auto">

          {!uniqueDomains.length && (
            <h1 className="text-foreground/50 w-full p-2 text-center">No logged domains</h1>
          )}

          {uniqueDomains.map((domain, i) => {
            return (
              <section key={i} className="h-12 hover:bg-secondary py-2 px-4 flex items-center border-t">
                <h1 className="text-foreground/80">{domain}</h1>
              </section>
            )
          })}
        </div>
      </div>

      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full h-full flex items-center justify-center bg-secondary/20 p-20">
          <FieldSet className="w-full">
            <FieldGroup>
              <Field orientation={"vertical"}>
                <FieldLabel htmlFor="target-domain">Target Domain</FieldLabel>
                <Input 
                  className="w-full h-10" 
                  id="target-domain" 
                  type="text" 
                  placeholder="*" 
                  value={proxyTarget}
                  aria-invalid={isInvalid}
                  onChange={(e) => {
                    setIsInvalid(false);
                    setProxyTarget(e.target.value)
                  }}
                />
                <FieldDescription className="font-semibold text-sm">
                  {isInvalid ? "Invalid domain" : "Choose target site"}
                </FieldDescription>
                <FieldDescription className="font-semibold text-sm whitespace-pre">
                  {"\t* Do not include http:// or https://\n\t* Do not add trailing slash or /\n\t* Use * to cover sub-domains (example: *.domain.com)"}
                </FieldDescription>
                <Button
                  className="max-w-20 self-start mt-3" 
                  onClick={onSave}
                >Save</Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </div>
      </div>
    </div>
  )
}

export default Target
