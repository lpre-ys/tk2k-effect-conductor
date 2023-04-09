export default function toFloatOrNull(value) {
  return value === "" ? null : parseFloat(value);
};