import TrezorConnect from "@trezor/connect-web";

const keysButton = document.getElementById("keys-button")!;
const initButton = document.getElementById("init-button")!;

const usbButton = document.getElementById("usb-button")!;

document.getElementById("location-placeholder")!.innerText = `${
  window.location.hostname
}[${window.parent === window ? "root" : "frame"}]`;

usbButton.addEventListener("click", async () => {
  try {
    const device = await navigator.usb.requestDevice({
      filters: [{ vendorId: 0x1209 }], // 1209:53c1
    });
    await device.open();
    await device.selectConfiguration(1);

    console.log(device);

    await device.close();
  } catch (e) {
    console.log(e);
  }
});

initButton.addEventListener("click", () => {
  TrezorConnect.init({
    lazyLoad: true, // this param will prevent iframe injection until TrezorConnect.method will be called
    manifest: {
      email: "developer@xyz.com",
      appUrl: "http://your.application.com",
    },
    transportReconnect: false,
    transports: ["WebUsbTransport"],
  })
    .then(() => {
      console.log("trezor init done");
      keysButton.removeAttribute("disabled");
    })
    .catch((e: unknown) => {
      console.error("trezor init error", e);
    });
});

keysButton.addEventListener("click", () => {
  TrezorConnect.getPublicKey({
    coin: "ETH",
    path: `m/44'/60'/0'/0`,
  })
    .then((response: any) => {
      if (!response.success) {
        throw response.payload;
      }
      console.log("trezor getPublicKey response", response);
    })
    .catch((e) => {
      console.log("trezor getPublicKey error", e);
    });
});
