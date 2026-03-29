import { format, formatDistanceToNowStrict } from 'date-fns';
import {
  HiveDetailResponse,
  InspectionResponse,
  InspectionStatus,
  ActionResponse,
} from 'shared-schemas';
import i18n from '@/lib/i18n';
import { getDateLocale } from '@/utils/locale-utils.ts';

function formatDate(date: string | Date): string {
  return format(new Date(date), 'P', { locale: getDateLocale(i18n.language), });
}

function getActionLabel(action: ActionResponse): string {
  switch (action.type) {
    case 'FEEDING':
      if (action.details?.type === 'FEEDING') {
        return (
          i18n.t('hive:llmPrompt.textArea.fed', {
            amount: action.details.amount,
            unit: action.details.unit,
            feedType: action.details.feedType,
            concentration: action.details.concentration
              ? `(${action.details.concentration})`
              : '',
          }) ||
          `Fed ${action.details.amount} ${action.details.unit} of ${action.details.feedType}${
            action.details.concentration
              ? ` (${action.details.concentration})`
              : ''
          }`
        );
      }
      return i18n.t('hive:llmPrompt.textArea.feeding') || 'Feeding';
    case 'TREATMENT':
      if (action.details?.type === 'TREATMENT') {
        return (
          i18n.t('hive:llmPrompt.textArea.treatedWith', {
            product: action.details.product,
            quantity: action.details.quantity,
            unit: action.details.unit,
          }) ||
          `Treated with ${action.details.product} (${action.details.quantity} ${action.details.unit})`
        );
      }
      return i18n.t('hive:llmPrompt.textArea.treatment') || 'Treatment';
    case 'FRAME':
      if (action.details?.type === 'FRAME') {
        return (
          action.details.quantity === 1
            ? i18n.t('hive:llmPrompt.textArea.addedFrame', {
                quantity: action.details.quantity,
              }) || `Added ${action.details.quantity} frame`
            : i18n.t('hive:llmPrompt.textArea.addedFrames', {
                quantity: action.details.quantity,
              }) || `Added ${action.details.quantity} frames`
        );
      }
      return (
        i18n.t('hive:llmPrompt.textArea.frameManagement') || 'Frame management'
      );
    case 'HARVEST':
      if (action.details?.type === 'HARVEST') {
        return (
          i18n.t('hive:llmPrompt.textArea.harvested', {
            amount: action.details.amount,
            unit: action.details.unit,
          }) || `Harvested ${action.details.amount} ${action.details.unit}`
        );
      }
      return i18n.t('hive:llmPrompt.textArea.harvest') || 'Harvest';
    case 'NOTE':
      return i18n.t('hive:llmPrompt.textArea.note') || 'Note';
    case 'BOX_CONFIGURATION':
      return (
        i18n.t('hive:llmPrompt.textArea.boxConfiguration') ||
        'Box configuration'
      );
    default:
      return action.type;
  }
}

export function generateHivePrompt(
  hive: HiveDetailResponse,
  inspections: InspectionResponse[] | undefined,
): string {
  const lines: string[] = [];
  // Preamble
  lines.push(i18n.t('hive:llmPrompt.textArea.description') || 'You are an experienced beekeeping advisor. Please analyze the following hive data and provide your assessment.');
  lines.push('');

  // Hive overview
  lines.push('## ' + i18n.t('hive:llmPrompt.textArea.hiveOverview') || 'Hive Overview');
  lines.push('- ' + i18n.t('hive:llmPrompt.textArea.nameValue', { name: hive.name }) || `Name: ${hive.name}`);
  lines.push('- ' + i18n.t('hive:llmPrompt.textArea.statusValue', { status: hive.status }) || `Status: ${hive.status}`);
  if (hive.installationDate) {
    const installDate = new Date(hive.installationDate);
    const age = formatDistanceToNowStrict(installDate, { locale: getDateLocale(i18n.language) });
    const installDateLabel = i18n.t('hive:llmPrompt.textArea.installationDate') || 'Installation Date';
    const oldLabel = i18n.t('hive:llmPrompt.textArea.old') || 'old';
    lines.push(`- ${installDateLabel}: ${formatDate(hive.installationDate)} (${age} ${oldLabel})`);
  }
  if (hive.notes) {
    lines.push('- ' + i18n.t('hive:llmPrompt.textArea.notes', { notes: hive.notes }) || `Notes: ${hive.notes}`,);
  }
  lines.push('');

  // Queen info
  lines.push('## ' + i18n.t('hive:llmPrompt.textArea.queenInformation') || 'Queen Information');
  if (hive.activeQueen) {
    const q = hive.activeQueen;
    if (q.status) lines.push('- ' + i18n.t('hive:llmPrompt.textArea.statusValue', { status: q.status }) || `Status: ${q.status}`);
    if (q.year) lines.push('- ' + i18n.t('hive:llmPrompt.textArea.yearValue', { year: q.year }) || `Year: ${q.year}`,);
    if (q.marking) lines.push('- ' + i18n.t('hive:llmPrompt.textArea.markingValue', { marking: q.marking, }) || `Marking: ${q.marking}`,);
    if (q.source) lines.push('- ' + i18n.t('hive:llmPrompt.textArea.sourceValue', { source: q.source, }) || `Source: ${q.source}`,);
    if (q.installedAt) {
      lines.push('- ' + i18n.t('hive:llmPrompt.textArea.installedValue', { installedAt: formatDate(q.installedAt) }) || `Installed: ${formatDate(q.installedAt)}`,);
    }
  } else {
    lines.push(i18n.t('hive:llmPrompt.textArea.noActiveQueenRecorded') || 'No active queen recorded.',);
  }
  lines.push('');

  // Box configuration
  if (hive.boxes.length > 0) {
    lines.push('## ' + i18n.t('hive:llmPrompt.textArea.boxConfiguration') || 'Box Configuration');
    const sortedBoxes = [...hive.boxes].sort((a, b) => a.position - b.position);
    for (const box of sortedBoxes) {
      const parts = [i18n.t('hive:llmPrompt.textArea.position',{ position: box.position, type: box.type }) || `Position ${box.position}: ${box.type}`,];
      if (box.variant) parts.push(i18n.t('hive:llmPrompt.textArea.variant', { variant: box.variant }) || `variant=${box.variant}`,);
      parts.push(`${box.frameCount} ${i18n.t('hive:llmPrompt.textArea.frames') || 'frames'}`,);
      if (box.hasExcluder) parts.push(i18n.t('hive:llmPrompt.textArea.withExcluder') || 'with excluder',);
      if (box.winterized) parts.push(i18n.t('hive:llmPrompt.textArea.winterized') || 'winterized');
      lines.push(`- ${parts.join(', ')}`);
    }
    lines.push('');
  }

  // Health scores
  const score = hive.hiveScore;
  if (
    score.overallScore !== null ||
    score.populationScore !== null ||
    score.storesScore !== null ||
    score.queenScore !== null
  ) {
    lines.push('## ' + i18n.t('hive:llmPrompt.textArea.healthScores') || 'Health Scores');
    if (score.overallScore !== null)
      lines.push('- ' + i18n.t('hive:llmPrompt.textArea.overallScore', { overallScore: score.overallScore, }) || `Overall: ${score.overallScore}/10`,);
    if (score.populationScore !== null)
      lines.push('- ' + i18n.t('hive:llmPrompt.textArea.population', { populationScore: score.populationScore, }) || `Population: ${score.populationScore}/10`,);
    if (score.storesScore !== null)
      lines.push('- ' + i18n.t('hive:llmPrompt.textArea.stores', { storesScore: score.storesScore, }) || `Stores: ${score.storesScore}/10`,);
    if (score.queenScore !== null)
      lines.push('- ' + i18n.t('hive:llmPrompt.textArea.queen', { queenScore: score.queenScore, }) || `Queen: ${score.queenScore}/10`);
    if (score.warnings.length > 0) {
      lines.push('- ' + i18n.t('hive:llmPrompt.textArea.warnings', { warnings: score.warnings.join('; '), }) || `Warnings: ${score.warnings.join('; ')}`,);
    }
    lines.push('');
  }

  // Active alerts
  const activeAlerts = hive.alerts.filter(a => a.status === 'ACTIVE');
  if (activeAlerts.length > 0) {
    lines.push('## ' + i18n.t('hive:llmPrompt.textArea.activeAlerts') || 'Active Alerts');
    for (const alert of activeAlerts) {
      lines.push(`- [${alert.severity}] ${alert.message}`);
    }
    lines.push('');
  }

  // Hive settings
  if (hive.settings) {
    lines.push('## ' + i18n.t('hive:llmPrompt.textArea.hiveSettings') || 'Hive Settings',);
    if (hive.settings.inspection) {
      lines.push('- ' + i18n.t('hive:llmPrompt.textArea.inspectionFrequency', { frequencyDays: hive.settings.inspection.frequencyDays, }) || `Inspection frequency: every ${hive.settings.inspection.frequencyDays} days`,);
    }
    if (hive.settings.autumnFeeding) {
      const af = hive.settings.autumnFeeding;
      lines.push('- ' + i18n.t('hive:llmPrompt.textArea.autumnFeeding', { amountKg: af.amountKg, startMonth: af.startMonth, endMonth: af.endMonth }) || `Autumn feeding: ${af.amountKg}kg, months ${af.startMonth}-${af.endMonth}`,);
    }
    lines.push('');
  }

  // Recent inspections
  const completedInspections = (inspections ?? [])
    .filter(i => i.status === InspectionStatus.COMPLETED)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  if (completedInspections.length > 0) {
    lines.push('## ' + i18n.t('hive:llmPrompt.textArea.recentInspections', { completedInspections: completedInspections.length }) || `Recent Inspections (last ${completedInspections.length})`,);
    for (const insp of completedInspections) {
      lines.push('');
      lines.push(`### ${formatDate(insp.date)}`);

      if (insp.temperature !== null && insp.temperature !== undefined) {
        lines.push('- ' + i18n.t('hive:llmPrompt.textArea.temperature', { temperature: insp.temperature, }) || `Temperature: ${insp.temperature}°C`,);}
      if (insp.weatherConditions) {
        lines.push('- ' + i18n.t('hive:llmPrompt.textArea.weather', { weatherConditions: insp.weatherConditions, }) || `Weather: ${insp.weatherConditions}`,);
      }

      // Observations — only non-null fields
      if (insp.observations) {
        const obs = insp.observations;
        if (obs.strength !== null && obs.strength !== undefined)
          lines.push('- ' + i18n.t('hive:llmPrompt.textArea.colonyStrength', { strength: obs.strength }) || `Colony strength: ${obs.strength}/10`,);
        if (obs.uncappedBrood !== null && obs.uncappedBrood !== undefined)
          lines.push('- ' + i18n.t('hive:llmPrompt.textArea.uncappedBrood', { uncappedBrood: obs.uncappedBrood, }) || `Uncapped brood: ${obs.uncappedBrood}/10`,);
        if (obs.cappedBrood !== null && obs.cappedBrood !== undefined)
          lines.push('- ' + i18n.t('hive:llmPrompt.textArea.cappedBrood', { cappedBrood: obs.cappedBrood, }) || `Capped brood: ${obs.cappedBrood}/10`);
        if (obs.honeyStores !== null && obs.honeyStores !== undefined)
          lines.push('- ' + i18n.t('hive:llmPrompt.textArea.honeyStores', { honeyStores: obs.honeyStores, }) || `Honey stores: ${obs.honeyStores}/10`,);
        if (obs.pollenStores !== null && obs.pollenStores !== undefined)
          lines.push('- ' + i18n.t('hive:llmPrompt.textArea.pollenStores', { pollenStores: obs.pollenStores, }) || `Pollen stores: ${obs.pollenStores}/10`,);
        if (obs.queenCells !== null && obs.queenCells !== undefined)
          lines.push('- ' + i18n.t('hive:llmPrompt.textArea.queenCells', { queenCells: obs.queenCells, }) || `Queen cells: ${obs.queenCells}`,);
        const yes = i18n.t('hive:llmPrompt.textArea.llmPromptYes') || 'Yes';
        const no = i18n.t('hive:llmPrompt.textArea.llmPromptNo') || 'No';
        if (obs.swarmCells !== null && obs.swarmCells !== undefined) {
          lines.push('- ' + i18n.t('hive:llmPrompt.textArea.swarmCells', { swarmCells: obs.swarmCells ? yes : no, }) || `Swarm cells: ${obs.swarmCells ? yes : no}`,);
        }
        if (obs.supersedureCells !== null && obs.supersedureCells !== undefined)
          lines.push(
            '- ' +
              i18n.t('hive:llmPrompt.textArea.supersedureCells', {
                supersedureCells: obs.supersedureCells ? yes : no,
              }) || `Supersedure cells: ${obs.supersedureCells ? yes : no}`,
          );
        if (obs.queenSeen !== null && obs.queenSeen !== undefined)
          lines.push('- ' + i18n.t('hive:llmPrompt.textArea.queenSeen', { queenSeen: obs.queenSeen ? yes : no, }) || `Queen seen: ${obs.queenSeen ? yes : no}`,);
        if (obs.broodPattern)
          lines.push('- ' + i18n.t('hive:llmPrompt.textArea.broodPattern', { broodPattern: obs.broodPattern, }) || `Brood pattern: ${obs.broodPattern}`,);
        if (obs.additionalObservations && obs.additionalObservations.length > 0)
          lines.push('- ' + i18n.t('hive:llmPrompt.textArea.additionalObservations', { additionalObservations: obs.additionalObservations, }) || `Additional observations: ${obs.additionalObservations.join(', ')}`,);
        if (obs.reminderObservations && obs.reminderObservations.length > 0)
          lines.push('- ' + i18n.t('hive:llmPrompt.textArea.reminderObservations', { reminderObservations: obs.reminderObservations, }) || `Reminders: ${obs.reminderObservations.join(', ')}`,);
      }

      // Actions
      if (insp.actions && insp.actions.length > 0) {
        lines.push('- ' + i18n.t('hive:llmPrompt.textArea.actionsTaken') || `Actions taken:`,);
        for (const action of insp.actions) {
          const label = getActionLabel(action as ActionResponse);
          lines.push(`  - ${label}${action.notes ? ` — ${action.notes}` : ''}`);
        }
      }

      if (insp.notes) {
        lines.push('- ' + i18n.t('hive:llmPrompt.textArea.notes', { notes: insp.notes }) || `Notes: ${insp.notes}`,);
      }

      // Inspection score
      if (insp.score) {
        const s = insp.score;
        const scoreParts: string[] = [];
        if (s.overallScore !== null)
          scoreParts.push(i18n.t('hive:llmPrompt.textArea.overall', { overallScore: s.overallScore, }) || `overall=${s.overallScore}`,);
        if (s.populationScore !== null)
          scoreParts.push(i18n.t('hive:llmPrompt.textArea.populationScore', { populationScore: s.populationScore, }) || `population=${s.populationScore}`,);
        if (s.storesScore !== null)
          scoreParts.push(i18n.t('hive:llmPrompt.textArea.storesScore', { storesScore: s.storesScore, }) || `stores=${s.storesScore}`,);
        if (s.queenScore !== null) scoreParts.push(i18n.t('hive:llmPrompt.textArea.queenScore', { queenScore: s.queenScore, }) || `queen=${s.queenScore}`,);
        if (scoreParts.length > 0) {
          lines.push('- ' + i18n.t('hive:llmPrompt.textArea.scores', { scores: scoreParts.join(', '), }) || `Scores: ${scoreParts.join(', ')}`,);
        }
        if (s.warnings.length > 0) {
          lines.push('- ' + i18n.t('hive:llmPrompt.textArea.scoreWarnings', { scoreWarnings: s.warnings.join('; '), }) || `Score warnings: ${s.warnings.join('; ')}`,);
        }
      }
    }
    lines.push('');
  } else {
    lines.push('## ' + i18n.t('hive:llmPrompt.textArea.noRecentInspections') || 'Recent Inspections',);
    lines.push(i18n.t('hive:llmPrompt.textArea.noCompletedInspections') || 'No completed inspections recorded.');
    lines.push('');
  }

  // Closing
  lines.push('---');
  lines.push('');
  lines.push(i18n.t('hive:llmPrompt.textArea.closingPromptTitle') || 'Based on the data above, please provide:');
  lines.push('1. ' + i18n.t('hive:llmPrompt.textArea.closingPromptFirst') || 'An overall health assessment of this hive');
  lines.push('2. ' + i18n.t('hive:llmPrompt.textArea.closingPromptSecond') || 'Any concerns or issues you identify');
  lines.push('3. ' + i18n.t('hive:llmPrompt.textArea.closingPromptThird') || 'Recommended actions for the beekeeper');
  lines.push('4. ' + i18n.t('hive:llmPrompt.textArea.closingPromptFourth') || 'Seasonal considerations based on the inspection history');

  return lines.join('\n');
}
