function onOpen() {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu("グループ作成")
      .addItem("メンバーを指定", "showModal")
      .addToUi();
  }
  
  // モーダルを表示する関数
  function showModal() {
    const html = HtmlService.createHtmlOutputFromFile("Dialog")
      .setWidth(700)
      .setHeight(500);
    SpreadsheetApp.getUi().showModalDialog(html, "グループ作成");
  }
  
  // メンバーリストを取得し、チェックボックスを動的に生成
  function getMemberList() {
    const sheet = SpreadsheetApp.openById("1MhvZ6edttNBOWozU_1FdbEFq19OKy6LQkQxSEj1w1OY").getSheetByName("memberList");
    const memberRange = sheet.getRange("A1:A");  // メンバーリストが格納されている範囲
    const memberList = memberRange.getValues().filter(String).map(row => row[0]);
  
    return memberList;
  }
  
  // モーダルで受け取ったデータでグループを作成
  function createGroupsFromModal(data) {
    if (!data.members || !data.groupSize) {
      throw new Error("メンバーリストまたはグループサイズが指定されていません。");
    }
  
    let members = data.members.split(",").map((member) => member.trim());
    members = Array.from(new Set(members)); // 重複を削除
  
    const groupSize = parseInt(data.groupSize, 10);
    if (isNaN(groupSize) || groupSize <= 0) {
      throw new Error("グループサイズは正の整数で指定してください。");
    }
  
    // メンバーをシャッフル
    const shuffledMembers = shuffleArray(members);
  
    // グループ分け
    const groups = [];
    for (let i = 0; i < shuffledMembers.length; i += groupSize) {
      groups.push(shuffledMembers.slice(i, i + groupSize));
    }
  
    // スプレッドシートに書き込む
    const sheet = SpreadsheetApp.openById("1MhvZ6edttNBOWozU_1FdbEFq19OKy6LQkQxSEj1w1OY").getActiveSheet();
    sheet.clear(); // シートをクリア
  
    groups.forEach((group, index) => {
      const row = index + 1;
      sheet.getRange(row, 1).setValue(`グループ${index + 1}`);
      sheet.getRange(row, 2).setValue(group.join(", "));
    });
  }
  
  // 配列をランダムにシャッフルする関数
  function shuffleArray(array) {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
  