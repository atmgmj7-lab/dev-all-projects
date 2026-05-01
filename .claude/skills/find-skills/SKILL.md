---
name: find-skills
description: List all available skills installed in ~/.claude/skills/ and everything-claude-code plugin. Use when asked to find, list, or discover available skills.
user-invocable: true
---

# Find Skills

List all installed skills with their names and descriptions.

## Step 1: Collect global skills

Run the following to enumerate all SKILL.md files (excluding node_modules):

```bash
echo "=== ~/.claude/skills/ ==="
find ~/.claude/skills -name "SKILL.md" ! -path "*/node_modules/*" | sort | while read f; do
  NAME=$(grep -m1 "^name:" "$f" 2>/dev/null | sed 's/name: //')
  DESC=$(grep -m1 "^description:" "$f" 2>/dev/null | sed 's/description: //')
  echo "- [$NAME] $f"
  echo "  $DESC"
done

echo ""
echo "=== everything-claude-code plugin skills ==="
ECC_DIR=$(find ~/.claude/plugins/cache/everything-claude-code -name "SKILL.md" 2>/dev/null | head -1 | xargs dirname | xargs dirname 2>/dev/null)
if [ -n "$ECC_DIR" ]; then
  find "$ECC_DIR" -name "SKILL.md" | sort | while read f; do
    NAME=$(grep -m1 "^name:" "$f" 2>/dev/null | sed 's/name: //')
    DESC=$(grep -m1 "^description:" "$f" 2>/dev/null | sed 's/description: //')
    INVOCABLE=$(grep -m1 "^user-invocable:" "$f" 2>/dev/null | sed 's/user-invocable: //')
    [ "$INVOCABLE" = "true" ] && echo "- [$NAME] $DESC"
  done
else
  echo "(not found)"
fi
```

## Step 2: Present results

Show two sections:

**ローカルスキル（~/.claude/skills/）**

| スキル名 | 説明 |
|---------|------|
| ...     | ...  |

**ECC プラグインスキル（user-invocable のみ）**

| スキル名 | 説明 |
|---------|------|
| ...     | ...  |

Show total counts at the end.

## Notes
- ローカルスキルは直接 `~/.claude/skills/` に配置されたもの
- ECC スキルは `/skill-name` 形式でスラッシュコマンドから呼び出せる
- `user-invocable: true` のスキルのみユーザーが直接呼び出し可能
