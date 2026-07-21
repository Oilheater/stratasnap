import ReportViewClient from "./ReportViewClient";

export const metadata = {
  title: "Strata Summary",
};

export default function ReportPage({ params }) {
  return <ReportViewClient reportId={params.id} />;
}
