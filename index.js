window.onload = () => {
  initialize();
  document.getElementById("shuffle").onclick = initialize;
};

// Initialize
const initialize = () => {
  //Resets
  document.getElementById("label").innerHTML = "";
  document.getElementById("label2").innerHTML = "";

  //Pad
  const header = document.getElementById("header").getBoundingClientRect();
  document.getElementById("pad").style.marginTop = `${
    header.bottom - header.top + 20
  }px`;

  //Toggle for annualized or monthly - warning: annualized data WILL lag
  const OUR_LORDS = yeet();
  //const OUR_LORDS = veryYeet().flat();

  displayTableData(OUR_LORDS);
  //displayPlanStats(leMap);
  // displayCustomerSelection(customersUsingBestPlan(OUR_LORDS));
  dpa(customersUsingBestPlan(OUR_LORDS));
  displayCustomerOverpayment(OUR_LORDS);
  displayBWP(OUR_LORDS);
  displayColorbox(leMap);
};

//Returns decimal number; we will do the rounding in the frontend
const customersUsingBestPlan = (customers) => {
  let count = 0;
  customers.forEach(customer => customer.isUsingBestPlan() && count++);

  return (count / customers.length);
};

const calculateAvgOverpayment = (customers) => {
  let overpay = 0;
  customers.forEach((customer) => {
    overpay += customer.calculateOverpayment();
  });

  return (overpay / customers.length);
};

const getPlanCostByPlanName = (customer, planName) => {
  let cost = 0;
  customer.plans.forEach((plan) => {
    if (plan.name === planName) {
      cost = plan.calculateCost().toFixed(2);
    }
  });
  return cost;
}

//=============FRONTEND========================

const displayTableData = (customers) => {
  const customerTable = document.getElementsByClassName("customer-table")[0];
  customers.forEach((customer) => {
    let phoneDiv = document.createElement("div");
    phoneDiv.className = "item";
    phoneDiv.innerHTML = `(${(customer.phoneNumber + "").substring(0, 3)}) ${(customer.phoneNumber + "").substring(3, 6)}-${(customer.phoneNumber + "").substring(6)}`;

    let nameDiv = document.createElement("div");
    nameDiv.className = "item";
    nameDiv.innerHTML = customer.plan.name;

    let memoryDiv = document.createElement("div");
    memoryDiv.className = "item";
    memoryDiv.innerHTML = `${customer.dataUsage} MB`;

    let costDiv = document.createElement("div");
    costDiv.className = "item";
    const unlimitedBill = getPlanCostByPlanName(customer, "Unlimited");
    const suckerBill = getPlanCostByPlanName(customer, "Sucker");
    const basicBill = getPlanCostByPlanName(customer, "Basic");
    const comprehensiveBill = getPlanCostByPlanName(customer, "Comprehensive");
    // console.log(unlimitedBill);
    costDiv.innerHTML = `$${customer.plan.calculateCost().toFixed(2)}` + `<span style="padding-left: 3%;">(U-$${unlimitedBill}, S-$${suckerBill}, B-$${basicBill}, C-$${comprehensiveBill})</span>`;

    customerTable.append(phoneDiv, nameDiv, memoryDiv, costDiv);
  });
};

/*const displayPlanStats = (planUsage) => {
  const plans = document.getElementsByClassName("plans")[0];
  plans.querySelector(".basic .no-customer").innerHTML = `${planUsage.get("Basic").length}`;
  plans.querySelector(".comprehensive .no-customer").innerHTML = `${planUsage.get("Comprehensive").length}`;
  plans.querySelector(".sucker .no-customer").innerHTML = `${planUsage.get("Sucker").length}`;
  plans.querySelector(".unlimited .no-customer").innerHTML = `${planUsage.get("Unlimited").length}`;
};*/

const displayCustomerSelection = (data) => {
  const customerDiv = document.getElementsByClassName("customer")[0];
  customerDiv.querySelector(".best .plan-percentage").innerHTML = `${(data * 100).toFixed(2)}%`;
  customerDiv.querySelector(".worst .plan-percentage").innerHTML = `${
    ((1 - data) * 100).toFixed(2)
  }%`;
};

const displayCustomerOverpayment = (customers) => {
  document.getElementById("no-overpayment").innerHTML = `$${calculateAvgOverpayment(customers).toFixed(2)}`;
};

//MAKE SURE TO COLLAPSE THE CUSTOMER ARRAY!!!
const displayBWP = (customers) => {
  const bwpJSON = aggregateBestWorstPlan(customers);
  document.querySelector(".best .plan-rating-plan").innerHTML = bwpJSON.best;
  document.querySelector(".worst .plan-rating-plan").innerHTML = bwpJSON.worst;
}

//Displays circle pie wheel AND displays the label
const displayColorbox = (mappo) => {;
  const lePie = document.getElementById("pie");
  const leLabel = document.getElementById("label");
  const names = Array.from(mappo.keys());
  const colors = ['#FF652F', '#FFE400', '#14A76C', '#52b4fa']; //4 values lol
  let background = `radial-gradient(
    circle closest-side at center,
    #272727 0,
    #272727 26%,
    transparent 25%,
    transparent 80%,
    #272727 0
  ), conic-gradient(`;
  /*
    let background = `radial-gradient(
    circle closest-side at center,
    transparent 80%,
    #272727 0
  ), conic-gradient(`;
  */
  
  var total = names.reduce((cumL, curr) => cumL + +mappo.get(curr).length, 0);
  let currGradientPercent = 0;
  names.forEach((plan, idx) => {
    var percent = +(+mappo.get(plan).length / total * 100).toFixed(2);
    background += `${colors[idx]} ${currGradientPercent}% ${currGradientPercent + percent}%, `;
    currGradientPercent += percent;

    let li = document.createElement("li");
    li.className = "listo";
    
    let listoColor = document.createElement("div");
    listoColor.className = "listoColor";
    listoColor.style.backgroundColor = colors[idx];

    let listoContent = document.createElement("div");
    listoContent.className = "listoItems";

    let listoName = document.createElement("div");
    listoName.classList.add("label-highlight");
    listoName.innerHTML = plan;

    let listoPrice = document.createElement("div");
    listoPrice.innerHTML = "$" + mappo.get(plan)[0].plan.basePrice;

    let listoCust = document.createElement("div");
    listoCust.innerHTML = `${mappo.get(plan).length} Customers`;

    let listoPercent = document.createElement("div");
    listoPercent.innerHTML = `${percent}% of Users`;

    listoContent.append(listoName, listoPrice, listoCust, listoPercent);
    li.append(listoColor, listoContent);

    leLabel.appendChild(li);
  });
  
  background = background.replace(/, $/gm, ")");
  lePie.style.background = background;
}

const dpa = data => {
  const lePie = document.getElementById("pie2");
  const leLabel = document.getElementById("label2");
  const percents = [(data * 100).toFixed(2), ((1 - data) * 100).toFixed(2)];
  const names = ["Customers Using Best Plan", "Customers Using Worst Plan"];
  const colors = ['lightcoral', '#80F0F0']; //4 values lol
  let background = `radial-gradient(
    circle closest-side at center,
    #272727 0,
    #272727 26%,
    transparent 25%,
    transparent 80%,
    #272727 0
  ), conic-gradient(`;

  var currGradientPercent = 0;

  names.forEach((item, idx) => {
    background += `${colors[idx]} ${+currGradientPercent}% ${+currGradientPercent + +percents[idx]}%, `;
    currGradientPercent += +percents[idx];

    let li = document.createElement("li");
    li.className = "listo";
    
    let listoColor = document.createElement("div");
    listoColor.className = "listoColor";
    listoColor.style.backgroundColor = colors[idx];

    let listoContent = document.createElement("div");
    listoContent.className = "listoItems";

    let listoName = document.createElement("div");
    listoName.innerHTML = item;
    listoName.classList.add("label-highlight");

    let listoPercent = document.createElement("div");
    listoPercent.innerHTML = `${percents[idx]}% of Users`;

    listoContent.append(listoName, listoPercent);
    li.append(listoColor, listoContent);

    leLabel.appendChild(li);
  });

  background = background.replace(/, $/gm, ")");
  lePie.style.background = background;
  console.log(background)
}