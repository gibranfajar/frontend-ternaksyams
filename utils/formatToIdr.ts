export const formatToIDR = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0, // tanpa desimal
  }).format(value);
};

export default formatToIDR;