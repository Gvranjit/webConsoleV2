// const testArray = [
//      { id: "1", username: "Hari" },
//      { id: "2", username: "Sita" },
// ];
// const newArray = [];
// testArray.forEach((user) => {
//      newArray.push(user.username);
// });

// console.log(newArray.;

// const user = new User({
//      id: uuid.v4(),
//      firstName: "Gaurav",
//      secondName: "Ranjit",
//      email: "gvranjit@gmail.com",
//      password: "testing",
//      profileImage: "testing",
// });
// user.save();
const testArray = [
     { id: "HJsnru9c4F6fRntgAAAC", username: "SUBU" },
     { id: "e8QzPcs4PZtZmd_3AAAD", username: "Code" },
];

function getusers(testArray) {
     return testArray.map((user) => user.username).join(" ");
}
console.log(getusers(testArray));
