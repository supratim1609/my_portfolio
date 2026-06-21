"use strict";
/**
 * Activation Functions & Calculus for the Neural Network.
 *
 * This module contains the non-linear activation functions used in the Forward Pass,
 * and their corresponding mathematical derivatives used in Backpropagation (Chain Rule)
 * to calculate the gradients for weight adjustments.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sigmoid = sigmoid;
exports.dsigmoid = dsigmoid;
exports.relu = relu;
exports.drelu = drelu;
exports.tanh = tanh;
exports.dtanh = dtanh;
// Sigmoid function: squashes numbers between 0 and 1.
// Used for probability outputs.
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}
// The derivative of the Sigmoid function.
// Crucial for calculating the gradient during backpropagation.
// Math: f'(x) = f(x) * (1 - f(x))
function dsigmoid(y) {
    // Note: y is already the sigmoid output here.
    return y * (1 - y);
}
// ReLU (Rectified Linear Unit) function.
// Allows the network to learn non-linear patterns faster without the vanishing gradient problem.
function relu(x) {
    return Math.max(0, x);
}
// Derivative of ReLU.
// Math: 1 if x > 0 else 0
function drelu(y) {
    return y > 0 ? 1 : 0;
}
// Tanh (Hyperbolic Tangent) function.
// Squashes numbers between -1 and 1. Good for hidden layers.
function tanh(x) {
    return Math.tanh(x);
}
// Derivative of Tanh.
// Math: 1 - f(x)^2
function dtanh(y) {
    return 1 - (y * y);
}
