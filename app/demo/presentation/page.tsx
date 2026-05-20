import Presentation from '@/app/(dashboard)/plans/[id]/presentation/Presentation'
import { DEMO_ADVISOR, DEMO_CLIENT, DEMO_MODULES } from '@/lib/demo-data'

export default function DemoPresentationPage() {
  return (
    <Presentation
      planId="demo"
      clientName={DEMO_CLIENT.full_name}
      clientAge={DEMO_CLIENT.age}
      advisorName={DEMO_ADVISOR}
      modules={DEMO_MODULES}
      backHref="/demo"
    />
  )
}
