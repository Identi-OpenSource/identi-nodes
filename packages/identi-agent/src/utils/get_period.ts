export default function getPeriod(periodValue: string): any {
  if (periodValue.includes('y')) {
    const amount = periodValue.split('y')[0]
    return { amount, unit: 'years' }
  }
  if (periodValue.includes('m')) {
    const amount = periodValue.split('m')[0]
    return { amount, unit: 'months' }
  }
  const amount = periodValue.split('d')[0]
  return { amount, unit: 'days' }
}
