import { Component, Node } from "cc";

type ComponentConstructor<T> = new (...args: any[]) => T;

export function safeGetComponent<T extends Component>(node: Node, type: ComponentConstructor<T>): T {
  const existing = node.getComponent(type);
  if (existing) return existing;
  return node.addComponent(type);
}

