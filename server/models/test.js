const { toString } = require("lodash");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const listPageScheme = new Schema({
    page: Number,
    urlBeforeParam: String || null,
    urlAfterParam: String,
});

const listDependentsSchema = new Schema({
    author: String,
    repo: String,
    repoUrl: String,
    stars: Number,
    forks: Number,
});

const projectSchema = new Schema({
    projectName: {
        type: String,
        required: true,
    },
    url: String,
    listPage: [listPageScheme],
    listDependents: [listDependentsSchema],
    lastpage: Boolean,
    test: mongoose.ObjectId,
});
// console.log(projectSchema.path("projectName"));
const projectModel = mongoose.model("project", projectSchema);
projectInstance = new projectModel();
projectInstance.test = new mongoose.Types.ObjectId();
// projectInstance.projectName = "test";
// console.log(projectInstance instanceof projectModel);
// projectInstance.save(function (err, data) {
//   if (err) return console.error(err);
//   console.log(data.projectName + " saved to data.");
// });
async function find(query, callback) {
    const data = await projectModel.find();
    console.log(data);
}
// find();
const animalSchema = new Schema({
    name: String,
    type: String,
    tags: [String],
    age: Number,
    friends: [String],
});

// Assign a function to the "statics" object of our animalSchema
animalSchema.statics.findByName = function (name) {
    return this.find({ name: new RegExp(name, "i") });
};
// Or, equivalently, you can call `animalSchema.static()`.
animalSchema.static("findByBreed", function (breed) {
    return this.find({ breed });
});

const Animal = mongoose.model("Animal", animalSchema);
const animal = new Animal({
    name: "Fido",

    type: "Dog",
    tags: ["nice", "small"],
    age: 1,
    friends: ["Cat", "Human"],
});

// animal.save(function (err, data) {
//     if (err) return console.error(err);
//     console.log(data.name + " saved to data.");
// });

async function findByName(name) {
    let animals = await Animal.findByName("fido");
    animals = animals.concat(await Animal.findByBreed("Poodle"));
    console.log(animals);
}
// findByName();

module.exports = { projectModel };
