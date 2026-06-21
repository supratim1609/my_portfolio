/**
 * Activation Functions & Calculus for the Neural Network.
 *
 * This module contains the non-linear activation functions used in the Forward Pass,
 * and their corresponding mathematical derivatives used in Backpropagation (Chain Rule)
 * to calculate the gradients for weight adjustments.
 */
export declare function sigmoid(x: number): number;
export declare function dsigmoid(y: number): number;
export declare function relu(x: number): number;
export declare function drelu(y: number): number;
export declare function tanh(x: number): number;
export declare function dtanh(y: number): number;
