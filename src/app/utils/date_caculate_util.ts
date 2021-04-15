export class DateCaculateUtil {
  // 计算前后的时间差
   public static caculateDate(d1: any, d2?: string): number {
        const a = new Date(d1);
        const b = d2 ? new Date(d2): new Date();
        const diff = a.getTime() - b.getTime();
        const result = diff / (1000 * 60 * 60 * 24);
        return result;
      }
  // 计算剩余保质期
    public static caculateRestOfDate(e) {
        let endOfDate = null;
        switch (e.type) {
          case 'day':
            const a = new Date(e.birthdate);
            const b = new Date();
            const diff = a.getTime() - b.getTime();
            endOfDate = diff / (1000 * 60 * 60 * 24) + Number(e.number);
            break;
          case 'month':
            endOfDate = new Date(e.birthdate);
            endOfDate.setMonth(endOfDate.getMonth() + Number(e.number));
            endOfDate = DateCaculateUtil.caculateDate(endOfDate);
            break;
          case 'year':
            endOfDate = new Date(e.birthdate);
            endOfDate.setFullYear(endOfDate.getFullYear() + Number(e.number));
            endOfDate = DateCaculateUtil.caculateDate(endOfDate);
            break;
          default:
            break;
        }
        return endOfDate;
      }
  }
