'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type} </div>
    <div class="movements__value">${mov}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // acc.balance = balance;
  labelBalance.textContent = `${acc.balance} EUR`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}💶 `;

  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}💶 `;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}💶`;
};

// const user = 'Steven Thomas Williams';
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};
//EVENT HANDLER

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  //prevenet form ffrom submitting
  e.preventDefault();
  // console.log('Login');

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // console.log('LOGIN');

    //Display UI and msg
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(amount, receiverAcc);
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // console.log('Transfer valid');
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
});

// btnClose.addEventListener('click', function (e) {
//   e.preventDefault();
//   // console.log('close');
//   if (
//     inputCloseUsername.value === currentAccount.username &&
//     Number(inputClosePin.value) === currentAccount.pin
//   ) {
//     const index = accounts.findIndex(
//       acc => acc.username === currentAccount.username
//     );
//     console.log(index);
//     // accounts.splice(index, 1);
//   }
// });

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);

    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  // console.log('Hi');

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// console.log(accounts);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// Topic--SLICE, SPLICE, REVERSE, CONCAT and JOIN  --149

// let arr = ['a', 'b', 'c', 'd', 'e'];

// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));

//SPLICE

// console.log(arr.splice(-1));
// console.log(arr);
// arr.splice(1, 2);
// console.log(arr);

// //REVERSE

// const arr2 = ['j', 'i', 'k'];
// console.log(arr2.reverse());

// //CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// //JOIN
// console.log(letters.join('-'));

// Topic--The New **at** Method

// const arr = [1, , 2, 3, 4];
// console.log(arr[0]);
// console.log(arr.at(0));
// console.log(arr.at(-1));

// console.log('jonas'.at(0));

// Topic--Looping arrays:ForEach -- 151

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log('-------ForEach');

// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrem ${Math.abs(mov)}`);
//   }
// });

// Topic--forEach with maps and Sets--152

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// //Set
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, val, set) {
//   console.log(`${value}:${val}`);
// });

// Topic--156--The Map Method

// const eurToUSD = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUSD;
// });

// console.log(movements);
// console.log(movementsUSD);

// const movementsUSDfor = [];
// for (const mov of movements) movementsUSDfor.push(mov * eurToUSD);
// console.log(movementsUSDfor);

// const movementsUSDArrow = movements.map(mov => mov * eurToUSD);
// console.log(movementsUSDArrow);

// Topic--157 The Filter Method

// const deposits = movements.filter(function (val) {
//   return val > 0;
// });
// console.log(movements);
// console.log(deposits);

// const depositsFor = [];
// for (const mov of movements) {
//   if (mov > 0) {
//     depositsFor.push(mov);
//   }
// }
// console.log(depositsFor);

// const withdrawl = movements.filter(mov => mov < 0);
// console.log(withdrawl);

// const withdrawalFor = [];
// for (const mov of movements) {
//   if (mov < 0) withdrawalFor.push(mov);
// }
// console.log(withdrawalFor);

// Topic--158--The Reduce Method

// console.log(movements);
// const acc = 0;
// const balance = movements.reduce((acc, curr) => curr + acc, 0);
// console.log(balance);

// const balance = movements.reduce(function (acc, curr, i, arr) {
//   console.log(`Iteration ${i} : ${acc}`);
//   return acc + curr;
// }, 0);
// console.log(balance);

// const maxiVal = movements.reduce(function (cmp, mov) {
//   if (mov > cmp) {
//     cmp = mov;
//   }
//   return cmp;
// }, -Infinity);

// console.log(maxiVal);

// // Topic--The Find Method-- 164

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// Topic--The flat and flat Map method

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], 4, 5];
// console.log(arrDeep.flat(2));

// //FlatMap
// const overalBalance = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

// Topic--Sorting Arrays-- Lect-172

//strings
// const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

// //numbers
// console.log(movements);

// //Ascendding
// // movements.sort((a,b)=>{
// //   if(a<b) return -1;
// //   if(a>b) return 1;
// // });
// movements.sort((a, b) => a - b);
// console.log(movements);

// Topic--Array Grouping -- Lect --173

// const groupedMovemments = Object.groupBy(movements, movement =>
//   movement > 0 ? 'deposits' : 'withdrawals'
// );
// console.log(groupedMovemments);

// const groupedByActivity = Object.groupBy(accounts, account => {
//   const movementCount = account.movements.length;
//   if (movementCount >= 8) return 'very active';
//   if (movementCount >= 4) return 'active';
//   if (movementCount >= 1) return 'moderate';
//   return 'inactive';
// });
// console.log(groupedByActivity);

// Topic--More Ways of Creating and Filling Arrays--Lect--174

// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// const x = new Array(7);
// console.log(x);
// x.fill(1, 3, 5);
// console.log(x);

// arr.fill(23, 2, 6);
// console.log(arr);

// //Array from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (curr, i) => i + 1);
// console.log(z);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements_value'),
//     el => Number(el.textContent.replace('Euro', ''))
//   );
//   console.log(movementsUI);

//   const movementsUI2 = [...document.querySelectorAll('.movements_value')];
// });

// // Topic--Non-Destructive Method --Lect --175

// console.log(movements);
// const reversedMov = movements.toReversed();
// console.log(reversedMov);

// //toSorted (sort), toSpliced(splice)

// const newMovements = movements.with(1, 2000);
// console.log(newMovements);
// console.log(movements);

//Arrray Method Practice

// const numDeposit1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;
// console.log(numDeposit1000);

//4.
//this is a nice title->This Is a Nice Title
// const convertTitleCase = function (title) {
//   const exceptions = ['a', 'an'];
//   const titlecase = title.toLowerCase();
// };



