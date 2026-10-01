import { UI } from "@/app/components/ui-text";
import { T } from "@/app/components/language";
import { pageTitles } from "@/lib/copy";
import { LocalizedContent } from "@/app/components/language";
import Link from "next/link";
import { ArrowLeft, Bell, CircleAlert, ClipboardCheck, ListTodo } from "lucide-react";
import { getWorkspaceTasks } from "@/lib/performance-workspace";

export default function WorkspaceTasksPage() {
  const tasks = getWorkspaceTasks();
  const critical = tasks.filter((task) => task.severity === "critical").length;
  const warning = tasks.filter((task) => task.severity === "warning").length;
  const info = tasks.filter((task) => task.severity === "info").length;

  return (
    <div className="pageStack">
      <Link className="backLink" href="/workspace">
        <ArrowLeft size={16} aria-hidden="true" />
        <UI text="Back to workspace" /></Link>

      <section className="detailHero workspaceHero">
        <div>
          <p className="eyebrow"><UI text="Task queue / アラート / Cola de trabajo" /></p>
          <h1><T text={pageTitles["/workspace/tasks"]} /></h1>
          <p><LocalizedContent en={<>
            This queue keeps the workspace practical: missing tokens, incomplete league coverage,
            QA issues, report candidates, and blocked licensed-data adapters.
          </>} ja={<>
            不足しているAPIキー、未確認データ、QA課題、レポート候補を作業キューとして表示します。
          </>} es={<>
            La cola convierte problemas de datos en tareas claras: revisar, conectar, reportar o bloquear.
          </>} /></p>
        </div>
        <Link className="primaryAction" href="/workspace/data-readiness">
          <UI text="Check data sources" /></Link>
      </section>

      <section className="metricGrid">
        <article className="metric alert">
          <CircleAlert size={20} aria-hidden="true" />
          <span><UI text="Critical" /></span>
          <strong>{critical}</strong>
        </article>
        <article className="metric">
          <Bell size={20} aria-hidden="true" />
          <span><UI text="Warnings" /></span>
          <strong>{warning}</strong>
        </article>
        <article className="metric">
          <ClipboardCheck size={20} aria-hidden="true" />
          <span><UI text="Info" /></span>
          <strong>{info}</strong>
        </article>
        <article className="metric">
          <ListTodo size={20} aria-hidden="true" />
          <span><UI text="Total tasks" /></span>
          <strong>{tasks.length}</strong>
        </article>
      </section>

      <section className="workspaceTaskList" aria-label="Workspace tasks">
        {tasks.map((task) => (
          <article className={`workspaceTask ${task.severity}`} key={task.id}>
            <div>
              <span className={`pill ${task.severity}`}><UI text={task.severity} /></span>
              <p className="eyebrow"><UI text={task.area} /></p>
              <h2><UI text={task.title} /></h2>
              <p><UI text={task.detail} /></p>
            </div>
            <div className="moduleProof">
              <strong><UI text="Next action" /></strong>
              <span><UI text={task.nextAction} /></span>
            </div>
            <Link className="backLink" href={task.href}>
              <UI text="Open related page" /></Link>
          </article>
        ))}
      </section>
    </div>
  );
}
