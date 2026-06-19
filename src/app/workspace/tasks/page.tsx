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
        Back to workspace
      </Link>

      <section className="detailHero workspaceHero">
        <div>
          <p className="eyebrow">Task queue / アラート / Cola de trabajo</p>
          <h1>Turn data gaps into visible work.</h1>
          <p>
            This queue keeps the workspace practical: missing tokens, incomplete league coverage,
            QA issues, report candidates, and blocked licensed-data adapters.
          </p>
          <p className="jp">
            不足しているAPIキー、未確認データ、QA課題、レポート候補を作業キューとして表示します。
          </p>
          <p className="es">
            La cola convierte problemas de datos en tareas claras: revisar, conectar, reportar o bloquear.
          </p>
        </div>
        <Link className="primaryAction" href="/workspace/data-readiness">
          Check data sources
        </Link>
      </section>

      <section className="metricGrid">
        <article className="metric alert">
          <CircleAlert size={20} aria-hidden="true" />
          <span>Critical</span>
          <strong>{critical}</strong>
        </article>
        <article className="metric">
          <Bell size={20} aria-hidden="true" />
          <span>Warnings</span>
          <strong>{warning}</strong>
        </article>
        <article className="metric">
          <ClipboardCheck size={20} aria-hidden="true" />
          <span>Info</span>
          <strong>{info}</strong>
        </article>
        <article className="metric">
          <ListTodo size={20} aria-hidden="true" />
          <span>Total tasks</span>
          <strong>{tasks.length}</strong>
        </article>
      </section>

      <section className="workspaceTaskList" aria-label="Workspace tasks">
        {tasks.map((task) => (
          <article className={`workspaceTask ${task.severity}`} key={task.id}>
            <div>
              <span className={`pill ${task.severity}`}>{task.severity}</span>
              <p className="eyebrow">{task.area}</p>
              <h2>{task.title}</h2>
              <p>{task.detail}</p>
            </div>
            <div className="moduleProof">
              <strong>Next action</strong>
              <span>{task.nextAction}</span>
            </div>
            <Link className="backLink" href={task.href}>
              Open related page
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
