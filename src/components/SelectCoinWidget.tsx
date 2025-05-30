import { Flex, Select, Typography } from 'antd';

interface SelectCoinProps {
  price?: string
  setSelectedSymbol: (symbol: string) => void
  symbols?: string[],
  limit: number;
  setLimit: (limit: number) => void;
}

export const SelectCoinWidget = ({
                                   symbols, price, setSelectedSymbol, limit,
                                   setLimit
                                 }: SelectCoinProps) => {
  
  const limits = [ 50, 100, 200, 500, 1000, 2000, 3000, 4000, 5000 ];
  
  return (
    <Flex vertical={true} gap={20} align="start">
      <Flex vertical={true} gap={10} align="start">
      <Typography.Text style={{color: 'white'}}>Select Crypto</Typography.Text>
        <Select
          defaultValue="BTCUSDT"
          style={{width: 160}}
          onChange={(value) => setSelectedSymbol(value)}
          options={symbols?.map((el) => ({value: el, label: el}))}
        />
        <Typography.Text style={{color: 'white'}}>Select Period</Typography.Text>
        <Select
          style={{width: '100%'}}
          value={limit}
          onChange={setLimit}
          options={limits.map((value) => ({
            value: value,
            label: `${value} days`
          }))}
        />
        
        🪙 {price ? `$${parseFloat(price).toFixed(4)}` : 'Loading...'}
      </Flex>
    </Flex>
  )
}
