import { describe, it, expect } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import ShapeItem from '../../src/components/ShapeItem.vue';

describe('ShapeItem.vue', () => {
  const mockShape = {
    id: 'shape-123',
    type: 'rectangle',
    x: 50,
    y: 100,
    width: 200,
    height: 150,
    fill: '#ff0000'
  };

  it('renders correctly when not selected (Snapshot)', () => {
    const wrapper = shallowMount(ShapeItem, {
      props: {
        shape: mockShape,
        isSelected: false
      }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('renders correctly when selected (Snapshot)', () => {
    const wrapper = shallowMount(ShapeItem, {
      props: {
        shape: mockShape,
        isSelected: true
      }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });
});