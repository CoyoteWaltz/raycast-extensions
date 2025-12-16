import { Action, ActionPanel, Detail, showToast, Toast, open } from "@raycast/api";
import { showFailureToast } from "@raycast/utils";
import path from "path";
import fs from "fs";
import os from "os";
import { ParseResult } from "../types";
import { renderQrMarkdown } from "../utils/qrcode";

interface QrDetailProps {
  qr: string;
  url: ParseResult | null;
}

export function QrDetail({ qr, url }: QrDetailProps) {
  async function handleSaveQr() {
    if (!url) return;
    try {
      const base64 = qr.replace(/^data:image\/png;base64,/, "");
      const filePath = path.join(
        os.homedir(),
        "Downloads",
        `qr_${url.protocol?.split(":")[0]}_${url.hostname}_${new Date().toISOString().split("T")[0].replace(/-/g, "_")}.png`,
      );
      fs.writeFileSync(filePath, base64, "base64");
      showToast({ style: Toast.Style.Success, title: "Saved to Downloads", message: filePath });
      await open(filePath);
    } catch (error) {
      console.error(error);
      showFailureToast(error, { title: "Failed to save QR code" });
    }
  }

  return (
    <Detail
      markdown={url?.href ? renderQrMarkdown(qr, url.href) : ""}
      actions={
        url?.href ? (
          <ActionPanel>
            <Action.CopyToClipboard content={url.href} title="Copy URL" />
            <Action title="Save Qr Code to Downloads" onAction={handleSaveQr} />
          </ActionPanel>
        ) : undefined
      }
    />
  );
}
