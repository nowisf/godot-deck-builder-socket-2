import { syncVersionDTO } from "@dto/sync.dto";
import { configManager } from "src/data/config";
import { fichasManager } from "src/data/fichas";

export function syncVersions(syncVersionDTO: syncVersionDTO) {
  var version = configManager.getVersion();
  var ok = version == syncVersionDTO.version;
  var fichas;
  if (!ok) {
    fichas = fichasManager.getTodasJson();
  }
  return { ok, fichas, version };
}
