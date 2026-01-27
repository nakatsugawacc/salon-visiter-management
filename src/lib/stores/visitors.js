import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';

// 固定のチェックポイント
export const checkpoints = writable([
  { id: 1, name: '受付', order: 1, color: 'bg-blue-100' },
  { id: 2, name: '施術部屋A', order: 2, color: 'bg-purple-100' },
  { id: 3, name: '施術部屋B', order: 3, color: 'bg-pink-100' },
  { id: 4, name: '施術部屋C', order: 4, color: 'bg-indigo-100' },
  { id: 5, name: '完了', order: 5, color: 'bg-gray-100' }
]);

// 固定の来店者データ
const initialVisitors = [
  {
    id: 1,
    name: '山田 太郎',
    phone: '090-1234-5678',
    currentCheckpointId: 1,
    arrivedAt: new Date().toISOString(),
    status: '未来店',
    detailedStatus: '未来店', // 未来店, 受付, 入室, 着替え完了(施術前), 施術中, 施術完了, 退出準備中, 完了
    assignedRoom: null, // A, B, C
    qrToken: 'visitor-1-token',
    qrScannedAt: null,
    history: []
  },
  {
    id: 2,
    name: '佐藤 花子',
    phone: '090-2345-6789',
    currentCheckpointId: 1,
    arrivedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    status: '未来店',
    detailedStatus: '未来店',
    assignedRoom: null,
    qrToken: 'visitor-2-token',
    qrScannedAt: null,
    history: []
  },
  {
    id: 3,
    name: '鈴木 一郎',
    phone: '090-3456-7890',
    currentCheckpointId: 1,
    arrivedAt: new Date(Date.now() - 8 * 60000).toISOString(),
    status: '未来店',
    detailedStatus: '未来店',
    assignedRoom: null,
    qrToken: 'visitor-3-token',
    qrScannedAt: null,
    history: []
  },
  {
    id: 4,
    name: '田中 美咲',
    phone: '090-4567-8901',
    currentCheckpointId: 1,
    arrivedAt: new Date(Date.now() - 25 * 60000).toISOString(),
    status: '未来店',
    detailedStatus: '未来店',
    assignedRoom: null,
    qrToken: 'visitor-4-token',
    qrScannedAt: null,
    history: []
  }
];

// チェックインURLトークンとチェックポイントのマッピング
export const checkpointTokens = {
  'reception-001': 1,    // 受付
  'treatment-a-002': 2,  // 施術部屋A
  'treatment-b-003': 3,  // 施術部屋B
  'treatment-c-004': 4,  // 施術部屋C
  'complete-005': 5      // 完了
};

// 来店者トークンとIDのマッピング
export const visitorTokens = {
  'visitor-1-token': 1,
  'visitor-2-token': 2,
  'visitor-3-token': 3,
  'visitor-4-token': 4
};

// 来店者ストア
function createVisitorStore() {
  const { subscribe, set, update } = writable(initialVisitors);

  // ブラウザ環境でlocalStorageから読み込み
  if (browser) {
    const stored = localStorage.getItem('visitors');
    if (stored) {
      try {
        const parsedVisitors = JSON.parse(stored);
        // qrTokenが存在しない場合は初期データを使用
        if (parsedVisitors.some(v => !v.qrToken)) {
          console.log('古いデータ構造を検出。初期データで上書きします。');
          set(initialVisitors);
          localStorage.setItem('visitors', JSON.stringify(initialVisitors));
        } else {
          set(parsedVisitors);
        }
      } catch (e) {
        console.error('Failed to parse stored visitors', e);
        set(initialVisitors);
        localStorage.setItem('visitors', JSON.stringify(initialVisitors));
      }
    } else {
      // localStorageにデータがない場合は初期データを保存
      localStorage.setItem('visitors', JSON.stringify(initialVisitors));
    }

    // localStorage変更を監視（別タブでの更新を検知）
    window.addEventListener('storage', (e) => {
      if (e.key === 'visitors' && e.newValue) {
        try {
          set(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Failed to parse storage event', err);
        }
      }
    });
  }

  return {
    subscribe,
    moveVisitor: (visitorId, checkpointId) => {
      update(visitors => {
        const visitor = visitors.find(v => v.id === visitorId);
        if (visitor) {
          visitor.currentCheckpointId = checkpointId;
          visitor.arrivedAt = new Date().toISOString();
          visitor.status = '来店中';
          visitor.history = visitor.history || [];
          visitor.history.push({
            checkpointId,
            timestamp: new Date().toISOString()
          });
        }
        if (browser) {
          localStorage.setItem('visitors', JSON.stringify(visitors));
        }
        return visitors;
      });
    },
    updateStatus: (visitorId, newStatus, assignRoom = null) => {
      update(visitors => {
        const visitor = visitors.find(v => v.id === visitorId);
        if (visitor) {
          visitor.detailedStatus = newStatus;
          visitor.status = '来店中';
          
          // QRスキャン時刻を記録
          if (newStatus === '受付' && !visitor.qrScannedAt) {
            visitor.qrScannedAt = new Date().toISOString();
          }
          
          // 施術部屋の割り当て
          if (assignRoom && !visitor.assignedRoom) {
            visitor.assignedRoom = assignRoom;
            // チェックポイントを施術部屋に変更
            const roomId = assignRoom === 'A' ? 2 : assignRoom === 'B' ? 3 : 4;
            visitor.currentCheckpointId = roomId;
          }
          
          // 完了時
          if (newStatus === '完了') {
            visitor.status = '完了';
            visitor.currentCheckpointId = 5;
          }
          
          visitor.history = visitor.history || [];
          visitor.history.push({
            status: newStatus,
            timestamp: new Date().toISOString()
          });
        }
        if (browser) {
          localStorage.setItem('visitors', JSON.stringify(visitors));
        }
        return visitors;
      });
    },
    markReady: (visitorId) => {
      update(visitors => {
        const visitor = visitors.find(v => v.id === visitorId);
        if (visitor) {
          visitor.isReady = true;
          visitor.history = visitor.history || [];
          visitor.history.push({
            action: 'ready',
            timestamp: new Date().toISOString()
          });
        }
        if (browser) {
          localStorage.setItem('visitors', JSON.stringify(visitors));
        }
        return visitors;
      });
    },
    markTreatmentComplete: (visitorId) => {
      update(visitors => {
        const visitor = visitors.find(v => v.id === visitorId);
        if (visitor) {
          visitor.isTreatmentComplete = true;
          visitor.history = visitor.history || [];
          visitor.history.push({
            action: 'treatment_complete',
            timestamp: new Date().toISOString()
          });
        }
        if (browser) {
          localStorage.setItem('visitors', JSON.stringify(visitors));
        }
        return visitors;
      });
    },
    reset: () => {
      set(initialVisitors);
      latestCheckin.set(null);
      if (browser) {
        localStorage.setItem('visitors', JSON.stringify(initialVisitors));
      }
    }
  };
}

export const visitors = createVisitorStore();

// 最新チェックインイベント（モーダル用）
export const latestCheckin = writable(null);

// 通知ストア
function createNotificationStore() {
  const { subscribe, update } = writable([]);

  return {
    subscribe,
    add: (notification) => {
      const id = Date.now();
      const entry = { ...notification, id };
      update(notifications => [...notifications, entry]);
      latestCheckin.set(entry);
      
      // 5秒後に自動削除
      setTimeout(() => {
        update(notifications => notifications.filter(n => n.id !== id));
      }, 5000);
    },
    addReady: (notification) => {
      const id = Date.now();
      const entry = { ...notification, id, type: 'ready' };
      update(notifications => [...notifications, entry]);
      latestCheckin.set(entry);
      
      // 5秒後に自動削除
      setTimeout(() => {
        update(notifications => notifications.filter(n => n.id !== id));
      }, 5000);
    },
    addTreatmentComplete: (notification) => {
      const id = Date.now();
      const entry = { ...notification, id, type: 'treatment_complete' };
      update(notifications => [...notifications, entry]);
      latestCheckin.set(entry);
      
      // 5秒後に自動削除
      setTimeout(() => {
        update(notifications => notifications.filter(n => n.id !== id));
      }, 5000);
    },
    remove: (id) => {
      update(notifications => notifications.filter(n => n.id !== id));
    }
  };
}

export const notifications = createNotificationStore();
