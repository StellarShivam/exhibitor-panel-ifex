import { featureFlags } from 'src/config-global';
import PlanYourVisitView from 'src/sections/buyer/plan-your-visit/view/plan-your-visit-view';
import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Plan Your Travel',
};

export default function Page() {
  if(!featureFlags.planYourVisit) {
    return <NotFoundView />;
  }
  return <PlanYourVisitView />;
}
