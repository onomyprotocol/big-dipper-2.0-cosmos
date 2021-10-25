import React from 'react';
import renderer from 'react-test-renderer';
import ListNames from '.';

// ==================================
// mocks
// ==================================
jest.mock('@contexts', () => ({
  useChainContext: () => ({
    findAddress: jest.fn((address) => {
      if (address === 'desmosvaloper1rzhewpmmdl72lhnxj6zmxr4v94f522s4hyz467') {
        return ({
          moniker: 'Valdator A',
          imageUrl: 'https://raw.githubusercontent.com/forbole/big-dipper-assets/master/bitsong/logo.svg?sanitize=true',
        });
      }
      if (address === 'desmosvaloper1jh753mzjy358jf86cfqqzkrrtqqefhjxctcre4') {
        return ({
          moniker: 'Valdator B',
          imageUrl: 'https://raw.githubusercontent.com/forbole/big-dipper-assets/master/bitsong/logo.svg?sanitize=true',
        });
      }
      if (address === 'desmosvaloper14nfk5gm99gfrd7nwqtmtvzunzclz8720a6cqh7') {
        return ({
          moniker: 'Valdator C',
        });
      }
      if (address === 'desmos1hfhkduejung7g29wv863x369rndf3hu5xj4g93') {
        return ({
          moniker: 'Valdator D',
        });
      }
      return (
        {
          moniker: 'moniker',
          imageUrl: null,
        }
      );
    }),
  }),
}));

jest.mock('@components', () => ({
  Name: (props) => <div id={props.address} {...props} />,
}));

// ==================================
// unit tests
// ==================================
describe('screen: TransactionDetails/IssueDenom', () => {
  it('matches snapshot', () => {
    const component = renderer.create(
      <ListNames
        creators={[
          'desmos1hfhkduejung7g29wv863x369rndf3hu5xj4g93',
          'desmosvaloper14nfk5gm99gfrd7nwqtmtvzunzclz8720a6cqh7',
          'desmosvaloper1jh753mzjy358jf86cfqqzkrrtqqefhjxctcre4',
          'desmosvaloper1rzhewpmmdl72lhnxj6zmxr4v94f522s4hyz467',
        ]}
      />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    expect(component.root.findAllByType('div').length).toBeGreaterThan(3);
    expect(component.root.findByProps({ id: 'desmos1hfhkduejung7g29wv863x369rndf3hu5xj4g93' }).props.name).toBe('Valdator D');
    expect(component.root.findByProps({ id: 'desmos1hfhkduejung7g29wv863x369rndf3hu5xj4g93' }).props.id).toBe('desmos1hfhkduejung7g29wv863x369rndf3hu5xj4g93');
    expect(component.root.findByProps({ id: 'desmos1hfhkduejung7g29wv863x369rndf3hu5xj4g93' }).props.id).not.toBe('desmosvaloper1rzhewpmmdl72lhnxj6zmxr4v94f522s4hyz467');
    expect(component.root.findAllByProps({ name: 'moniker' }).length).toBe(0);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
