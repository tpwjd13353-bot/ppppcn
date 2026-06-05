// 어드민 전용 제안서 생성 페이지.
// /admin/layout.tsx 에서 이미 어드민 가드 적용됨.

import { ProposalGenerator } from "./ProposalGenerator";

export const dynamic = "force-dynamic";

export default function AdminProposalPage() {
  return <ProposalGenerator />;
}
