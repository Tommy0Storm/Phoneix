# 📧 Phoenix Projects Email Signature with QR Code

## 🎯 Features
- **Professional Layout** with Phoenix branding
- **Interactive QR Code** that opens AI Jannie chatbot instantly
- **Clickable CTA Button** for desktop users
- **Responsive Design** works in all email clients
- **Auto-opens Chatbot** when scanned or clicked

## 📱 How to Use

### For Gmail:
1. Open Gmail → Click Settings (gear icon) → See all settings
2. Scroll to "Signature" section
3. Click "Create new" or edit existing
4. **Paste the HTML from `EMAIL_SIGNATURE.html`** (use Ctrl+Shift+V)
5. Click "Save Changes"

### For Outlook (Desktop):
1. File → Options → Mail → Signatures
2. Click "New" or select existing signature
3. Click in the text box
4. Click "Insert" → "Signature" → Paste as HTML
5. Click OK to save

### For Outlook (Web):
1. Settings → View all Outlook settings → Compose and reply
2. Under "Email signature", paste the HTML
3. Click Save

### For Apple Mail:
1. Mail → Preferences → Signatures
2. Create new signature
3. Open Terminal and run:
   ```bash
   open ~/Library/Mail/V*/MailData/Signatures/
   ```
4. Edit the .mailsignature file with your HTML
5. Restart Mail

## 🔗 How It Works

The QR code and button link to:
```
https://tommy0storm.github.io/Phoneix/?chat=open
```

When someone clicks or scans:
1. Opens Phoenix Projects website
2. **Automatically opens AI Jannie chatbot**
3. Ready to provide instant quotes!

## 🎨 Customization

The QR code is generated dynamically with Phoenix brand colors:
- Background: White (#ffffff)
- Foreground: Phoenix Red (#E63946)
- Size: 120x120px (optimized for email)

### To Change QR Code Colors:
Edit the `color` parameter in the QR code URL:
```
color=E63946  ← Change this hex code
```

### To Change Button Text:
Edit this line in EMAIL_SIGNATURE.html:
```html
💬 Get Instant Quote from AI Jannie
```

## 📊 What Recipients See

**Desktop Users:**
- Professional signature with logo
- Contact information
- Clickable "Get Instant Quote" button
- QR code for mobile scanning

**Mobile Users:**
- Same professional layout
- Tap button or QR code → Opens chatbot instantly
- Perfect for on-the-go quotes

## ✅ Tested & Compatible With:
- ✅ Gmail (Web & App)
- ✅ Outlook (Desktop, Web, Mobile)
- ✅ Apple Mail
- ✅ Yahoo Mail
- ✅ Most mobile email clients

## 🚀 Pro Tips

1. **Test First**: Send yourself an email to verify it displays correctly
2. **Mobile Check**: Scan the QR code with your phone to test
3. **Consistency**: Use the same signature across all email accounts
4. **Analytics**: Track clicks by adding UTM parameters to the URL

## 📈 Expected Results

- **Higher Engagement**: People love QR codes - quick and professional
- **Instant Quotes**: No waiting for phone calls or email replies
- **24/7 Availability**: AI Jannie answers instantly, any time
- **Professional Image**: Modern, tech-forward construction company

## 🔧 Troubleshooting

**QR Code Not Showing:**
- Some email clients block external images by default
- Recipients need to "Show Images" in their email client

**Button Not Working:**
- Verify the URL is correct in the HTML
- Check that link is not disabled by corporate email filters

**Layout Broken:**
- Make sure you pasted as HTML, not plain text
- Try using Ctrl+Shift+V when pasting

## 📞 Support

Questions? Contact:
- Email: andrewtruter2@gmail.com
- Phone: 079 463 5951

---

**Phoenix Projects** - Building Excellence Since 2009 🏆
