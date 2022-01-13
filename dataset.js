//--------------------PLAN SECTION---------------------------
const Plan = class {
  constructor(name, basePrice, freeMb, mbCharge, mbUsed) {
    this.name = name;
    this.basePrice = basePrice;
    this.freeMb = freeMb;
    this.mbCharge = mbCharge;
    this.mbUsed = mbUsed;
  }

  calculateCost = () =>
    this.basePrice + Math.max(0, (this.mbUsed - this.freeMb) * this.mbCharge);
}

const PLANS = [
  class extends Plan {
    constructor(mbUsed) {
      super("Basic", 19.99, 1000, 0.1, mbUsed);
    }
  },
  class extends Plan {
    constructor(mbUsed) {
      super("Comprehensive", 24.99, 4000, 0.25, mbUsed);
    }
  },
  class extends Plan {
    constructor(mbUsed) {
      super("Sucker", 4.99, 0, 0.02, mbUsed);
    }
  },
  class extends Plan {
    constructor(mbUsed) {
      super("Unlimited", 49.99, 0, 0, mbUsed);
    }
  }
];

const PLAN_NAMES = PLANS.map((x) => new x(0).name);

//--------------CUSTOMER SECTION---------------------------
//You have been promoted to customer lmao
//@see yeet function - the used numbers are generated there

//Tracks plan usage
leMap = new Map();
PLAN_NAMES.forEach((name) => leMap.set(name, [])); //May be redundant, save in case

//Assumes the customer's plan doesn't change once initialized
//Which tbf doesn't happen in the specs
class Customer {
  constructor(USED_NUMBERS) {
    this.phoneNumber = (() => {
      while (true) {
        var num = Math.round(Math.random() * 9000000000) + 1000000000;
        if (!USED_NUMBERS.has(num)) {
          USED_NUMBERS.add(num);
          return num;
        }
      }
    })();

    this.dataUsage = Math.ceil(Math.random() * 40000);
    this.plans = Array(PLANS.length)
      .fill(0)
      .map((itm, idx) => {
        return new PLANS[idx](this.dataUsage);
      })
      .sort((plan1, plan2) => plan1.calculateCost() - plan2.calculateCost());

    this.plan = this.plans[Math.floor(Math.random() * this.plans.length)];

    //Yeets the plan into leMap
    leMap.get(this.plan.name).push(this);
  }

  //Generates random data usage amount and updates the plan accordingly
  randomMb() {
    this.dataUsage = Math.ceil(Math.random() * 40000);
    this.plans.forEach((helloThere) => {
      helloThere.mbUsed = this.dataUsage;
    });
    this.plans.sort(
      (plan1, plan2) => plan1.calculateCost() - plan2.calculateCost()
    );
  }

  calculateOverpayment() {
    return this.plan.calculateCost() - this.plans[0].calculateCost();
  }

  isUsingBestPlan() {
    return this.plan.name == this.plans[0].name;
  }
}

//---------------------STUFF WE'LL USE SOMEWHERE ELSE LOL---------------------------
//Non-annualized data
yeet = () => {
  PLAN_NAMES.forEach((name) => leMap.set(name, []));
  const USED_NUMBERS = new Set();
  return new Array(Math.round(Math.random() * 9000) + 1000)
  //return Array(Math.round(Math.random() * 10) + 1)
    .fill(0)
    .map((pineapplesGoOnPizza) => new Customer(USED_NUMBERS));
};

//Use this instead of yeet for annualized data\
//But watch out though because it's multiplying data by 12
veryYeet = () => {
  let thing = yeet();
  thing.slice(0, Math.min(thing.length, 1000));
    return thing.map((plan) => {
      let temp = new Array(12).fill(0).map(reeeeeeeeeeeeeeeeeeeeeeee => ({}));
      temp.forEach((target) => {
        Object.assign(target, plan);
        target.__proto__ = plan.__proto__;
        target.randomMb();
      });

      return temp;
    }
  );
};

//-------------------Data Analysis--------------------
//These take in an array of all data plans
//For annualized data, make sure you collapse the array

//@returns JSON for best and worst plan
aggregateBestWorstPlan = (customers) => {
  let aggregate = {};
  PLAN_NAMES.forEach((plan) => {
    aggregate[plan] = { best: 0, worst: 0 };
  });

  customers.forEach((customer) => {
    aggregate[customer.plans[0].name].best++;
    aggregate[customer.plans[customer.plans.length - 1].name].worst++;
  });

  var best;
  var worst;

  Object.keys(aggregate).forEach((key) => {
    best ||= key;
    worst ||= key;

    if (aggregate[key].best > aggregate[best].best) best = key;
    if (aggregate[key].worst > aggregate[worst].worst) worst = key;
  });
  return { best: best, worst: worst };
};
