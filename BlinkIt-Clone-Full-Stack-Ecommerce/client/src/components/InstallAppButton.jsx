import usePWAInstall from "../hooks/usePWAInstall";

export default function InstallAppButton() {
  const { install, canInstall, isInstalled } = usePWAInstall();

  // iOS detection
  const isIOS =
    /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());

  if (isInstalled) return null;

  if (isIOS) {
    return (
      <div className="p-3 bg-yellow-100 text-sm rounded">
        📲 To install this app:
        <br />
        Tap <b>Share</b> → <b>Add to Home Screen</b>
      </div>
    );
  }

  if (!canInstall) return null;

  return (
    <button
      onClick={install}
      className="px-4 py-2 bg-green-600 text-white rounded shadow"
    >
      📥 Install App
    </button>
  );
}
