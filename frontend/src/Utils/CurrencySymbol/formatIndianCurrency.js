export const formatIndianCurrency = (amount) => {
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  return amount < 0 ? ` ( ₹ ${formattedAmount})` : `₹ ${formattedAmount}`;
};

export const numberToWords = (num) => {
  const units = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const thousands = ["", "Thousand", "Lakh", "Crore"];

  function convertToWords(num) {
    if (num === 0) return "Zero";

    let result = "";
    let i = 0;

    while (num > 0) {
      if (num % 1000 !== 0) {
        result =
          convertHundreds(num % 1000) +
          (thousands[i] ? " " + thousands[i] : "") +
          " " +
          result;
      }
      num = Math.floor(num / 1000);
      i++;
    }

    return result.trim() + " Only";
  }

  function convertHundreds(num) {
    let str = "";

    if (num >= 100) {
      str += units[Math.floor(num / 100)] + " Hundred ";
      num %= 100;
    }

    if (num >= 20) {
      str += tens[Math.floor(num / 10)] + " ";
      num %= 10;
    }

    if (num > 0) {
      str += units[num] + " ";
    }

    return str.trim();
  }

  return convertToWords(num);
};
