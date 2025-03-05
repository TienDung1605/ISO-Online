import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'convert',
    data: { pageTitle: 'isoApp.convert.home.title' },
    loadChildren: () => import('./convert/convert.routes'),
  },
  {
    path: 'evaluator',
    data: { pageTitle: 'isoApp.evaluator.home.title' },
    loadChildren: () => import('./evaluator/evaluator.routes'),
  },
  {
    path: 'frequency',
    data: { pageTitle: 'isoApp.frequency.home.title' },
    loadChildren: () => import('./frequency/frequency.routes'),
  },
  {
    path: 'title',
    data: { pageTitle: 'isoApp.title.home.title' },
    loadChildren: () => import('./title/title.routes'),
  },
  {
    path: 'parts',
    data: { pageTitle: 'isoApp.parts.home.title' },
    loadChildren: () => import('./parts/parts.routes'),
  },
  {
    path: 'check-target',
    data: { pageTitle: 'isoApp.checkTarget.home.title' },
    loadChildren: () => import('./check-target/check-target.routes'),
  },
  {
    path: 'checker-group',
    data: { pageTitle: 'isoApp.checkerGroup.home.title' },
    loadChildren: () => import('./checker-group/checker-group.routes'),
  },
  {
    path: 'check-level',
    data: { pageTitle: 'isoApp.checkLevel.home.title' },
    loadChildren: () => import('./check-level/check-level.routes'),
  },
  {
    path: 'criteria',
    data: { pageTitle: 'isoApp.criteria.home.title' },
    loadChildren: () => import('./criteria/criteria.routes'),
  },
  {
    path: 'criteria-group',
    data: { pageTitle: 'isoApp.criteriaGroup.home.title' },
    loadChildren: () => import('./criteria-group/criteria-group.routes'),
  },
  {
    path: 'report-type',
    data: { pageTitle: 'isoApp.reportType.home.title' },
    loadChildren: () => import('./report-type/report-type.routes'),
  },
  {
    path: 'sample-report',
    data: { pageTitle: 'isoApp.sampleReport.home.title' },
    loadChildren: () => import('./sample-report/sample-report.routes'),
  },
  {
    path: 'inspection-report-titles',
    data: { pageTitle: 'isoApp.inspectionReportTitles.home.title' },
    loadChildren: () => import('./inspection-report-titles/inspection-report-titles.routes'),
  },
  {
    path: 'sample-report-criteria',
    data: { pageTitle: 'isoApp.sampleReportCriteria.home.title' },
    loadChildren: () => import('./sample-report-criteria/sample-report-criteria.routes'),
  },
  {
    path: 'plan',
    data: { pageTitle: 'isoApp.plan.home.title' },
    loadChildren: () => import('./plan/plan.routes'),
  },
  {
    path: 'report',
    data: { pageTitle: 'isoApp.report.home.title' },
    loadChildren: () => import('./report/report.routes'),
  },
  {
    path: 'report-criteria',
    data: { pageTitle: 'isoApp.reportCriteria.home.title' },
    loadChildren: () => import('./report-criteria/report-criteria.routes'),
  },
  {
    path: 'report-title',
    data: { pageTitle: 'isoApp.reportTitle.home.title' },
    loadChildren: () => import('./report-title/report-title.routes'),
  },
  {
    path: 'script',
    data: { pageTitle: 'isoApp.script.home.title' },
    loadChildren: () => import('./script/script.routes'),
  },
  {
    path: 'inspection-report',
    data: { pageTitle: 'isoApp.inspectionReport.home.title' },
    loadChildren: () => import('./inspection-report/inspection-report.routes'),
  },
  {
    path: 'gross-script',
    data: { pageTitle: 'isoApp.grossScript.home.title' },
    loadChildren: () => import('./gross-script/gross-script.routes'),
  },
  {
    path: 'field',
    data: { pageTitle: 'isoApp.field.home.title' },
    loadChildren: () => import('./fields/fields.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
