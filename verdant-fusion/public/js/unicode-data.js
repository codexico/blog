/**
 * Curated Popular Glyphs & Bilingual Synonym Dictionary
 */

// Curated 45 Popular & Essential Characters for 'Início'
const POPULAR_GLYPHS = [
  { symbol: '✨', hex: '2728', dec: '10024', section: 'Dingbats', name: 'SPARKLES' },
  { symbol: '🚀', hex: '1F680', dec: '128640', section: 'Transport & Maps', name: 'ROCKET' },
  { symbol: '⌘', hex: '2318', dec: '8984', section: 'Misc Technical', name: 'COMMAND KEY' },
  { symbol: '✅', hex: '2705', dec: '10004', section: 'Dingbats', name: 'WHITE HEAVY CHECK MARK' },
  { symbol: '🔥', hex: '1F525', dec: '128293', section: 'Misc Pictographs', name: 'FIRE' },
  { symbol: '❤️', hex: '2764', dec: '10084', section: 'Misc Symbols', name: 'HEAVY BLACK HEART' },
  { symbol: '➔', hex: '2794', dec: '10132', section: 'Dingbats', name: 'HEAVY RIGHTWARDS ARROW' },
  { symbol: '💯', hex: '1F4AF', dec: '128175', section: 'Misc Pictographs', name: 'HUNDRED POINTS SYMBOL' },
  { symbol: '⭐', hex: '2B50', dec: '11088', section: 'Misc Symbols', name: 'WHITE MEDIUM STAR' },
  { symbol: '💡', hex: '1F4A1', dec: '128161', section: 'Misc Pictographs', name: 'ELECTRIC LIGHT BULB' },
  { symbol: '📌', hex: '1F4Push', dec: '128204', section: 'Misc Pictographs', name: 'PUSHPIN' },
  { symbol: '🎉', hex: '1F389', dec: '127881', section: 'Misc Pictographs', name: 'PARTY POPPER' },
  { symbol: '👍', hex: '1F44D', dec: '128077', section: 'Emoticons', name: 'THUMBS UP SIGN' },
  { symbol: '☕', hex: '2615', dec: '9749', section: 'Misc Symbols', name: 'HOT BEVERAGE' },
  { symbol: '🔒', hex: '1F512', dec: '128274', section: 'Misc Pictographs', name: 'LOCK' },
  { symbol: '⚡', hex: '26A1', dec: '9889', section: 'Misc Symbols', name: 'HIGH VOLTAGE SIGN' },
  { symbol: '₿', hex: '20BF', dec: '8383', section: 'Currency Symbols', name: 'BITCOIN SIGN' },
  { symbol: '€', hex: '20AC', dec: '8364', section: 'Currency Symbols', name: 'EURO SIGN' },
  { symbol: '∞', hex: '221E', dec: '8734', section: 'Math Operators', name: 'INFINITY' },
  { symbol: '≠', hex: '2260', dec: '8800', section: 'Math Operators', name: 'NOT EQUAL TO' },
  { symbol: '🫠', hex: '1FAE0', dec: '129760', section: 'Emoticons', name: 'MELTING FACE' },
  { symbol: '🫣', hex: '1FAE1', dec: '129761', section: 'Emoticons', name: 'PEEKING EYE FACE' },
  { symbol: '🫡', hex: '1FAE2', dec: '129762', section: 'Emoticons', name: 'SALUTING FACE' },
  { symbol: '🥹', hex: '1F979', dec: '129401', section: 'Emoticons', name: 'HOLDING BACK TEARS FACE' },
  { symbol: '💀', hex: '1F480', dec: '128128', section: 'Emoticons', name: 'SKULL' },
  { symbol: '😭', hex: '1F631', dec: '128561', section: 'Emoticons', name: 'LOUDLY CRYING FACE' },
  { symbol: '😂', hex: '1F602', dec: '128514', section: 'Emoticons', name: 'FACE WITH TEARS OF JOY' },
  { symbol: '🤣', hex: '1F923', dec: '129315', section: 'Emoticons', name: 'ROLLING ON THE FLOOR LAUGHING' },
  { symbol: '👀', hex: '1F440', dec: '128064', section: 'Misc Pictographs', name: 'EYES' },
  { symbol: '🙌', hex: '1F64C', dec: '128588', section: 'Emoticons', name: 'PERSON RAISING BOTH HANDS' },
  { symbol: '🙏', hex: '1F64F', dec: '128591', section: 'Emoticons', name: 'PERSON WITH FOLDED HANDS' },
  { symbol: '💪', hex: '1F4AA', dec: '128074', section: 'Emoticons', name: 'FLEXED BICEPS' },
  { symbol: '🎯', hex: '1F3AF', dec: '127919', section: 'Misc Pictographs', name: 'DIRECT HIT' },
  { symbol: '💎', hex: '1F48D', dec: '128141', section: 'Misc Pictographs', name: 'GEM STONE' },
  { symbol: '🌟', hex: '1F31F', dec: '127775', section: 'Misc Pictographs', name: 'GLOWING STAR' },
  { symbol: '🍀', hex: '1F340', dec: '127808', section: 'Misc Pictographs', name: 'FOUR LEAF CLOVER' },
  { symbol: '⚙', hex: '2699', dec: '9881', section: 'Misc Technical', name: 'GEAR' },
  { symbol: '⌥', hex: '2325', dec: '8997', section: 'Misc Technical', name: 'OPTION KEY' },
  { symbol: '⇧', hex: '21E7', dec: '8679', section: 'Arrows', name: 'UPWARDS WHITE ARROW' },
  { symbol: '⌫', hex: '232B', dec: '9003', section: 'Misc Technical', name: 'ERASE TO THE LEFT' },
  { symbol: '⏎', hex: '23CE', dec: '9166', section: 'Misc Technical', name: 'RETURN SYMBOL' },
  { symbol: '💲', hex: '1F4B2', dec: '128178', section: 'Misc Pictographs', name: 'HEAVY DOLLAR SIGN' },
  { symbol: '✓', hex: '2713', dec: '2713', section: 'Dingbats', name: 'CHECK MARK' },
  { symbol: '❌', hex: '274C', dec: '10060', section: 'Dingbats', name: 'CROSS MARK' },
  { symbol: '⚠️', hex: '26A0', dec: '9888', section: 'Misc Symbols', name: 'WARNING SIGN' }
];

// Bilingual Synonym Dictionary (Portuguese & English)
const SYNONYMS = {
  // Directions & Arrows
  'up': ['upward', 'upwards', 'top', 'north', 'cima', 'arriba', '↑', '⬆', '⇡', '↟', '↥'],
  'down': ['downward', 'downwards', 'bottom', 'south', 'baixo', 'abajo', '↓', '⬇', '⇣', '↡', '↧'],
  'left': ['leftward', 'leftwards', 'west', 'esquerda', 'izquierda', '←', '⬅', '⇠', '⇤'],
  'right': ['rightward', 'rightwards', 'east', 'direita', 'derecha', '→', '➡', '⇢', '⇥'],

  // Actions, Status & UI
  'check': ['checkmark', 'tick', 'certo', 'ok', 'sucesso', 'sim', '✓', '✅', '✔', '☑'],
  'cross': ['cancel', 'delete', 'erro', 'errado', 'nao', 'fechar', 'lixeira', '✕', '❌', '✖', '❎'],
  'warning': ['hazard', 'danger', 'aviso', 'atencao', 'perigo', 'alerta', '⚠️', '⚡'],
  'search': ['magnifying', 'glass', 'busca', 'lupa', 'pesquisa', 'find', '🔍', '🔎'],
  'lock': ['padlock', 'secure', 'key', 'cadeado', 'senha', 'seguranca', '🔒', '🔓', '🔑'],
  'gear': ['wheel', 'sprocket', 'cog', 'engrenagem', 'config', 'settings', 'ajustes', '⚙'],
  'trash': ['delete', 'remove', 'lixeira', 'apagar', 'excluir', '🗑'],

  // Media, Tech & Communication
  'movie': ['film', 'cinema', 'projector', 'clapper', 'video', 'camera', 'filme', '🎬', '📹', '🎥'],
  'music': ['note', 'musical', 'score', 'sound', 'audio', 'musica', 'som', '🎵', '🎶', '🎼'],
  'phone': ['telephone', 'mobile', 'call', 'cell', 'telefone', 'celular', 'chamada', '☎', '📞', '📱'],
  'mail': ['email', 'envelope', 'letter', 'message', 'carta', 'mensagem', 'post', '✉', '📧', '📨'],
  'code': ['bracket', 'brace', 'chevron', 'terminal', 'codigo', 'dev', 'programacao', '</>', '{}'],

  // Finance & Currencies
  'money': ['cash', 'currency', 'dollar', 'euro', 'bitcoin', 'coin', 'cent', 'dinheiro', 'moeda', 'grana', '$', '€', '£', '¥', '₹', '₽', '₿'],
  'crypto': ['bitcoin', 'btc', 'ether', 'chain', 'cripto', '₿'],

  // Expressions, Nature & Elements
  'happy': ['smile', 'grin', 'joy', 'laugh', 'feliz', 'alegre', 'sorriso', '😀', '😂', '😊'],
  'sad': ['cry', 'tear', 'frown', 'sorrow', 'triste', 'choro', 'lagrima', '😢', '😭', '🥹'],
  'love': ['heart', 'like', 'affection', 'amor', 'coracao', 'curtir', '♡', '♥', '❤️', '💕'],
  'fire': ['flame', 'blaze', 'hot', 'fogo', 'chama', 'quente', 'em alta', '🔥'],
  'star': ['sparkle', 'asterisk', 'estrela', 'brilho', '★', '☆', '✨', '⭐', '🌟'],
  'sun': ['sunny', 'sunshine', 'day', 'sol', 'dia', '☀', '🌞'],
  'moon': ['night', 'lunar', 'crescent', 'lua', 'noite', '🌙', '🌕'],
  'rocket': ['launch', 'ship', 'foguete', 'lancamento', 'empresa', '🚀']
};

if (typeof module !== 'undefined') {
  module.exports = { POPULAR_GLYPHS, SYNONYMS };
}
