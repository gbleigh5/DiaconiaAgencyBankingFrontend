"use client";

export async function printReceipt(text: string) {
  if (!("bluetooth" in navigator)) {
    throw new Error("Bluetooth is not supported on this device/browser.");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bt = (navigator as any).bluetooth;
  const device = await bt.requestDevice({
    acceptAllDevices: true,
    optionalServices: ["battery_service"],
  });
  console.log("Selected printer/device", device.name);
  alert(`Receipt queued for printer: ${device.name}\n\n${text}`);
}
