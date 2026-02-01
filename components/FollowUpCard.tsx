import type { FollowUp } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type Props = {
  followUp: FollowUp;
};

export default function FollowUpCard({ followUp }: Props) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/80 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold capitalize">{followUp.type} follow-up</p>
        <span className="text-xs text-black/50">{formatDate(followUp.suggestedDate)}</span>
      </div>
      {followUp.subject ? (
        <p className="mt-2 text-sm font-semibold">{followUp.subject}</p>
      ) : null}
      <p className="mt-2 text-sm text-black/70">{followUp.content}</p>
    </div>
  );
}
