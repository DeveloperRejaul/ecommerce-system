import { FlatList, Image, View, useWindowDimensions, NativeSyntheticEvent, NativeScrollEvent, ViewStyle, Text, StyleSheet, Platform, ImageStyle } from 'react-native';
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import Skeleton from '../../components/Skeleton';
import { color } from '../../constants/color';
import { rcp } from '../utils/colorReduceOpacity';
import { urlConvert } from '../../utils/file';

interface IData {
    id?: string;
    imgUrl: string
}

interface ICardCarousal {
    data: IData[];
    loop?:boolean;
    duration?:number;
    play?: boolean;
    onStart?:(value: boolean)=>void
    onEnd?:(value: boolean)=> void;
    onChange?:(index: number) => void;
    height?: number;
    width?: number;
    nextBtn?: React.ReactNode;
    prevuesBtn?: React.ReactNode
    dotActiveColor?: string;
    dotInactiveColor?:string;
    containerStyle?:ViewStyle
    dotStyle?: ViewStyle
    dotActiveStyle?:ViewStyle,
    dotInactiveStyle?:ViewStyle,
    isLoading:boolean
    isError:boolean,
    imageStyle?:ImageStyle
}

let interval : NodeJS.Timeout;
export default forwardRef((props: ICardCarousal, ref) => {
  const { width: WIDTH } = useWindowDimensions();
  const {
    data = [],
    loop = true,
    play = true,
    height = Platform.OS === 'web' ? 300 : 200,
    width = WIDTH,
    onEnd,
    onStart,
    duration = 5000,
    onChange,
    nextBtn,
    prevuesBtn,
    dotActiveColor = 'green',
    dotInactiveColor = 'red',
    containerStyle,
    dotStyle,
    dotActiveStyle,
    dotInactiveStyle,
    isLoading,
    isError,
    imageStyle,
  } = props;
  const [activeIndex, setActiveIndex] = useState(0);
  const [start, setStart] = useState(play);
  const slider = useRef<FlatList>(null);

  useImperativeHandle(ref, () => ({
    scrollToIndex: (index: number) => {
      if (slider.current) {
        slider.current.scrollToIndex({ index, animated: true });
      }
    },
    next: () => {
      if (slider.current) {
        if (activeIndex === data.length - 1) {
          slider.current.scrollToIndex({ index: 0, animated: true });
        } else {
          slider.current.scrollToIndex({ index: activeIndex + 1, animated: true });
        }
      }
    },
    prevues: () => {
      if (slider.current) {
        if (activeIndex === 0) {
          slider.current.scrollToIndex({ index: data.length - 1, animated: true });
        } else {
          slider.current.scrollToIndex({ index: activeIndex - 1, animated: true });
        }
      }
    },
  }));

  useEffect(() => {
    if (play) {
      setStart(true);
    } else {
      setStart(false);
    }
  }, [play]);

  // off on control slider
  useEffect(() => {
    if (!isLoading && loop && start && data.length > 0) {
      interval = setInterval(() => {
        if (slider.current && activeIndex === data.length - 1) {
          onEnd?.(true);
          onChange?.(0);
          slider.current.scrollToIndex({
            index: 0,
            animated: true,
          });
        } else if (slider.current) {
          if (activeIndex === 0) onStart?.(true);
          onChange?.(activeIndex + 1);
          slider.current.scrollToIndex({
            index: activeIndex + 1,
            animated: true,
          });
        }
      }, duration);
    } else clearInterval(interval);
    return () => clearInterval(interval);
  });

  // for scrollToIndex
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getItemLayout = (_data:any, index:number) => ({
    length: width,
    offset: width * index,
    index,
  });

  const onScroll = (event:NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.ceil((Number(scrollPosition / width)) * 0.98);
    setActiveIndex(currentIndex);
  };

  //  dot indicator view
  const dotIndicator = () => data.map((_e, i) => (
    <View
      key={Math.random()}
      style={[styles.dotItem, {
        backgroundColor: activeIndex === i ? dotActiveColor : dotInactiveColor,
        ...dotStyle }, activeIndex === i ? dotActiveStyle : dotInactiveStyle,
      ]}
    />
  ));

  // handle key
  const keyExtractor = (item:IData, index:number) => item?.id || index.toString();

  const renderItem = ({ index, item }:{index:number, item:IData}) => (
    <Image
      key={index}
      style={{ height, resizeMode: 'cover', width, ...imageStyle }}
      source={{ uri: urlConvert(item.imgUrl) }}
      className="web:container"
    />
  );

  const renderSkeleton = () => <Skeleton hight={height} width={width} rounded={0} />;

  const networkError = () => (
    <View style={[styles.errorContainer, { width, height }]}>
      <Text style={styles.opp}> Opp! </Text>
      <Text style={styles.errorText}> Network error </Text>
    </View>
  );

  return (
    <View style={{ borderRadius: 10, overflow: 'hidden', ...containerStyle }}>
      {!isError && (
      <FlatList
        ref={slider}
        data={isLoading ? [{ id: '01', imgUrl: '' }] : data}
        renderItem={isLoading ? renderSkeleton : renderItem}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        onScroll={onScroll}
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
      )}
      {(!isLoading && isError) && networkError()}
      {nextBtn}
      {prevuesBtn}
      {!isLoading && data.length && !isError && (
      <View style={styles.dot}>
        {dotIndicator()}
      </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: rcp(color.dark, 10),
  },
  dot: {
    flexDirection: 'row',
    justifyContent: 'center',
    columnGap: 10,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
  },
  dotItem: {
    height: 10,
    width: 10,
    borderRadius: 100,
  },
  errorText: {
    fontSize: 14,
    color: color.dark,
  },
  opp: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.dark,
  },
});
