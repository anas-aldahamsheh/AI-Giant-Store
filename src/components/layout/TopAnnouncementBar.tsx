export type TopAnnouncementBarProps = {
  message?: string;
};

export function TopAnnouncementBar({
  message = "Giant Store demo: products and orders stay in your browser · no payment collected",
}: TopAnnouncementBarProps) {
  return (
    <div className="dark-mesh-bg relative overflow-hidden px-4 py-2 text-center text-sm font-semibold text-white">
      <div className="noise-overlay absolute inset-0 opacity-20" />
      <span className="relative">{message}</span>
    </div>
  );
}
