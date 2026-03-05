import RoomChecklist from './RoomChecklist';

const HotelPlay = () => {
  return (
    <div style={{ padding: '1rem', height: '100%', boxSizing: 'border-box' }}>
      {/* 호텔 놀이의 기본 화면으로 객실 체크리스트를 보여줍니다 */}
      <RoomChecklist />
    </div>
  );
};

export default HotelPlay;