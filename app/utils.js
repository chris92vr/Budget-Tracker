export const currencyFormatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
  });
  
  export const formatDate = (date) => {
    const d = new Date(date);
    console.log('date', date);
    return (
      ('0' + d.getDate()).slice(-2) +
      '/' +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      '/' +
      d.getFullYear() +
      ' ' +
      ('0' + d.getHours()).slice(-2) +
      ':' +
      ('0' + d.getMinutes()).slice(-2) +
      ':' +
      ('0' + d.getSeconds()).slice(-2)
    );
  };
  
    export const getProgressBarVariant = (amount, max) => {
        const ratio = amount / max;
        if (ratio < 0.5) return 'primary';
        if (ratio < 0.75) return 'warning';
        return 'danger';
    };


   
