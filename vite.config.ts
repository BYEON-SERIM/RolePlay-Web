import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 모든 아이피에서 접속 허용
    port: 5173, // 포트 번호를 고정하고 싶다면 추가 (선택사항)
  }
})
