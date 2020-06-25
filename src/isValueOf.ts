export default function isValueOf(obj: {}): (v: any) => boolean {
  return (v) =>
    Object.values(obj).some((ov) => {
      return ov === v
    })
}
