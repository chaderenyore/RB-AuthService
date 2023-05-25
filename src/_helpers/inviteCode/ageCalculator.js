exports.calculateAge = async (date) => {
  try {
    // ho;lders
    let ageConvertedToMonths;
    let ageConvertedToDays;
    let ageInMs = Date.parse(Date()) - Date.parse(date);
    let accountAge = new Date();
    accountAge.setTime(ageInMs);
    let ageYear = accountAge.getFullYear() - 1970 ;
    let ageMonth = accountAge.getMonth();
    let ageDay = accountAge.getDate();
    const accountAgeInfo = `${ageYear}:Year(s), ${ageMonth}:Month(s), ${ageDay}:Day` // fo refernce
    // convert to month if exist
    if(ageYear !== 0){
      ageConvertedToMonths = Number(ageYear) * 12 + Number(ageMonth)
    }
    // convert to day if exist
    if(ageYear !== 0 && ageMonth !== 0){
      ageConvertedToDays = (Number(ageYear) * 365) + (Number(ageMonth) * 30) + Number(ageMonth)
      if(ageDay !== 0){
        ageConvertedToDays += ageDay
      }
    }
    if(ageMonth !== 0 && (ageYear === 0)){
      ageConvertedToDays = (Number(ageMonth) * 30)
      if(ageDay !== 0){
        ageConvertedToDays += ageDay
      }
    }

    // return logic
    if(ageYear < 0){
      return {
        message: "Future Date Detected",
        error: true
      }
    }

    return {
        ageConvertedToMonths: ageConvertedToMonths || ageMonth,
        ageConvertedToDays: ageConvertedToDays || ageDay,
        fullAge: accountAgeInfo
    };
  } catch (error) {
    console.error(error);
  }
};
